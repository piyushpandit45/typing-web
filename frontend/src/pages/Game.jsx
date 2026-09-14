import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Motorcycle from "../components/Motorcycle";
import TypingPanel from "../components/TypingPanel";
import Loader from "../components/Loader";
import api, { getErrorMessage } from "../services/api";
import {
  aiBaseSpeed,
  calcAccuracy,
  calcWpm,
  formatTimer,
  playerSpeedPercentPerSecond,
  recentTopicIds,
  rememberTopic,
} from "../utils/gameMath";
import { getRequiredWpm, determineWinLoss } from "../utils/wpmRequirements";
import { useAuth } from "../context/AuthContext";

const RACE_SECONDS = 60;

export default function Game() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [setup] = useState(() => JSON.parse(sessionStorage.getItem("typerider_setup") || "null"));
  const [topic, setTopic] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [phase, setPhase] = useState("loading");
  const [count, setCount] = useState(3);
  const [hud, setHud] = useState({
    time: RACE_SECONDS,
    wpm: 0,
    accuracy: 100,
    speed: 0,
    nitro: "CHARGING",
  });
  const [progress, setProgress] = useState({ player: 0, cpu: 0 });
  const [typedText, setTypedText] = useState("");
  const [visibleLines, setVisibleLines] = useState([]);
  const [lineStartIndex, setLineStartIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [correctedMistakes, setCorrectedMistakes] = useState(0);
  const [currentErrors, setCurrentErrors] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const inputRef = useRef(null);
  const stateRef = useRef(null);
  const endedRef = useRef(false);
  const textContainerRef = useRef(null);

  useEffect(() => {
    if (!setup) {
      navigate("/play");
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        const exclude = recentTopicIds(setup.difficulty).join(",");
        const { data } = await api.get(`/topics/random/${setup.difficulty}`, {
          params: { exclude },
        });
        if (cancelled) return;
        setTopic(data.topic);
        rememberTopic(setup.difficulty, data.topic._id);
        setPhase("countdown");
      } catch (err) {
        setLoadError(getErrorMessage(err));
        setPhase("error");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [setup, navigate]);

  useEffect(() => {
    if (phase !== "countdown") return undefined;
    if (count === "GO") {
      const t = setTimeout(() => setPhase("racing"), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (count === 1) setCount("GO");
      else setCount(count - 1);
    }, 800);
    return () => clearTimeout(t);
  }, [phase, count]);

  // Intelligent text wrapping function
  const wrapTextIntoLines = useCallback((text, maxCharsPerLine = 45) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      if (testLine.length <= maxCharsPerLine) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }, []);

  // Calculate character position in full text for a given line
  const getCharPositionForLine = useCallback((lines, lineIndex) => {
    let position = 0;
    for (let i = 0; i < lineIndex; i++) {
      position += lines[i].length + 1; // +1 for space between lines
    }
    return position;
  }, []);

  // Calculate two visible lines based on current progress
  const calculateVisibleLines = useCallback((fullText, currentIndex, maxCharsPerLine = 45) => {
    const lines = wrapTextIntoLines(fullText, maxCharsPerLine);
    let charCount = 0;
    let currentLineIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length;
      if (charCount + lineLength > currentIndex) {
        currentLineIndex = i;
        break;
      }
      charCount += lineLength + 1; // +1 for space between lines
    }

    // Show current line and next line
    const visibleLines = lines.slice(currentLineIndex, currentLineIndex + 2);
    const startIndex = charCount;
    
    return { visibleLines, startIndex, currentLineIndex };
  }, [wrapTextIntoLines]);

  // Initialize visible lines when topic loads
  useEffect(() => {
    if (topic && phase === "racing") {
      const allLines = wrapTextIntoLines(topic.content);
      const initialLines = allLines.slice(0, 2);
      setVisibleLines(initialLines);
      setLineStartIndex(0);
    }
  }, [topic, phase, wrapTextIntoLines]);

  // Update visible lines as typing progresses
  useEffect(() => {
    if (topic && phase === "racing" && typedText.length > 0) {
      const allLines = wrapTextIntoLines(topic.content);
      
      // Calculate current line based on typed position
      let charCount = 0;
      let currentLineIndex = 0;

      for (let i = 0; i < allLines.length; i++) {
        const lineLength = allLines[i].length;
        if (charCount + lineLength > typedText.length) {
          currentLineIndex = i;
          break;
        }
        charCount += lineLength + 1;
      }

      const newLines = allLines.slice(currentLineIndex, currentLineIndex + 2);
      const newStart = charCount;
      
      // Only update if we've moved to a new section of text
      if (newLines.length > 0 && newStart !== lineStartIndex) {
        setTimeout(() => {
          if (!endedRef.current) {
            setVisibleLines(newLines);
            setLineStartIndex(newStart);
          }
        }, 100);
      }
    }
  }, [typedText, topic, phase, lineStartIndex, wrapTextIntoLines]);

  useEffect(() => {
    if (phase !== "racing" || !topic) return undefined;
    const start = performance.now();
    stateRef.current = {
      start,
      correct: 0,
      incorrect: 0,
      totalMistakes: 0,
      streak: 0,
      maxStreak: 0,
      player: 0,
      cpu: 0,
      displayPlayer: 0,
      displayCpu: 0,
      nitroUntil: 0,
      nitroReady: false,
      nitrosUsed: 0,
      lastNitroAt: -99999,
      mistakeUntil: 0,
      lastAiBump: start,
      text: topic.content,
    };
    endedRef.current = false;
    setTypedText("");
    setMistakes(0);
    setCorrectedMistakes(0);
    setCurrentErrors(0);
    setStreak(0);
    setMaxStreak(0);
    let raf;

    function finish(snapshot) {
      if (endedRef.current) return;
      endedRef.current = true;
      const elapsed = Math.max(1000, performance.now() - snapshot.start);
      const wpm = Math.round(calcWpm(snapshot.correct, elapsed));
      const accuracy = Math.round(calcAccuracy(snapshot.correct, snapshot.incorrect) * 10) / 10;
      const requiredWpm = getRequiredWpm(setup.difficulty);
      const result = determineWinLoss(wpm, setup.difficulty);
      const payload = {
        playerName: setup.name,
        country: setup.country,
        countryCode: setup.countryCode,
        difficulty: setup.difficulty,
        topicId: topic._id,
        topicName: topic.title,
        wpm,
        accuracy,
        correctChars: snapshot.correct,
        incorrectChars: snapshot.incorrect,
        maxStreak: snapshot.maxStreak,
        playerProgress: Math.round(snapshot.player * 10) / 10,
        opponentProgress: Math.round(snapshot.cpu * 10) / 10,
        requiredWpm,
        result,
      };
      sessionStorage.setItem("typerider_result", JSON.stringify(payload));
      api
        .post("/games", payload)
        .then(({ data }) => {
          if (data.user) updateUser(data.user);
        })
        .finally(() => navigate("/results"));
    }

    function loop(now) {
      const s = stateRef.current;
      const elapsed = now - s.start;
      const remaining = Math.max(0, RACE_SECONDS - elapsed / 1000);
      const wpm = calcWpm(s.correct, Math.max(elapsed, 400));
      const accuracy = calcAccuracy(s.correct, s.incorrect);
      const nitroActive = now < s.nitroUntil;
      const mistakeSlow = now < s.mistakeUntil;
      if (!nitroActive && s.streak >= 36 && accuracy >= 92 && s.nitrosUsed < 2 && now - s.lastNitroAt > 8000) {
        s.nitroReady = true;
        s.nitroUntil = now + 5000;
        s.nitrosUsed += 1;
        s.lastNitroAt = now;
        s.nitroReady = false;
      }
      const pSpeed = playerSpeedPercentPerSecond({
        wpm,
        accuracy,
        nitroActive: now < s.nitroUntil,
        mistakeSlow,
      });
      const dt = Math.min(0.05, (now - (s.prev || now)) / 1000) || 0.016;
      s.prev = now;
      s.player = Math.min(100, s.player + pSpeed * dt * 1.05);
      const base = aiBaseSpeed(setup.difficulty);
      const wobble = Math.sin(elapsed / 900) * 0.12 + Math.sin(elapsed / 2100) * 0.08;
      const dip = elapsed % 11000 < 1400 ? 0.72 : 1;
      const aiSpeed = Math.max(0.35, (base + wobble) * dip);
      s.cpu = Math.min(100, s.cpu + aiSpeed * dt);
      s.displayPlayer += (s.player - s.displayPlayer) * 0.12;
      s.displayCpu += (s.cpu - s.displayCpu) * 0.12;

      setHud({
        time: remaining,
        wpm: Math.round(wpm),
        accuracy: Math.round(accuracy),
        speed: Math.round(pSpeed * 68),
        nitro: now < s.nitroUntil ? "NITRO ON" : s.streak >= 28 ? "🔥 NITRO READY" : "CHARGING",
      });
      setProgress({ player: s.displayPlayer, cpu: s.displayCpu });

      if (remaining <= 0) {
        finish(s);
        return;
      }
      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);
    inputRef.current?.focus();
    return () => cancelAnimationFrame(raf);
  }, [phase, topic, setup, navigate, updateUser]);

  function onKeyDown(e) {
    if (phase !== "racing" || !stateRef.current) return;
    const s = stateRef.current;
    
    // Handle backspace
    if (e.key === "Backspace") {
      e.preventDefault();
      if (typedText.length > 0) {
        const removedChar = typedText[typedText.length - 1];
        const expectedChar = s.text[typedText.length - 1];
        
        setTypedText(prev => prev.slice(0, -1));
        
        // Update statistics based on what was removed
        if (removedChar === expectedChar) {
          s.correct = Math.max(0, s.correct - 1);
          s.streak = Math.max(0, s.streak - 1);
        } else {
          s.incorrect = Math.max(0, s.incorrect - 1);
          s.totalMistakes = Math.max(0, s.totalMistakes - 1);
          setCurrentErrors(Math.max(0, currentErrors - 1));
          setCorrectedMistakes(prev => prev + 1);
        }
        
        setStreak(s.streak);
        setMistakes(s.totalMistakes);
      }
      return;
    }
    
    // Handle tab
    if (e.key === "Tab") {
      e.preventDefault();
      return;
    }
    
    // Only handle single character keys
    if (e.key.length !== 1) return;
    
    e.preventDefault();
    
    const currentIndex = typedText.length;
    const expectedChar = s.text[currentIndex];
    
    if (expectedChar == null) {
      // End of text reached
      return;
    }
    
    // Always allow typing regardless of previous mistakes
    const newTypedText = typedText + e.key;
    setTypedText(newTypedText);
    
    if (e.key === expectedChar) {
      // Correct character
      s.correct += 1;
      s.streak += 1;
      s.maxStreak = Math.max(s.maxStreak, s.streak);
      setStreak(s.streak);
      setMaxStreak(s.maxStreak);
    } else {
      // Incorrect character
      s.incorrect += 1;
      s.totalMistakes += 1;
      s.streak = 0;
      s.mistakeUntil = performance.now() + 1100;
      setCurrentErrors(prev => prev + 1);
      setMistakes(s.totalMistakes);
      setStreak(0);
    }
  }

  if (!setup) return null;
  if (phase === "loading") return <Loader label="Staging the grid..." />;
  if (phase === "error") {
    return (
      <main className="page">
        <div className="alert">{loadError || "No topics available for this difficulty."}</div>
        <button className="btn btn-primary" onClick={() => navigate("/play")}>
          Back to setup
        </button>
      </main>
    );
  }

  return (
    <main className="game-page">
      {phase === "countdown" && (
        <div className="countdown" role="status">
          {count}
        </div>
      )}
      <div className="hud">
        <div className="card hud-item">
          <span>Timer</span>
          <strong>{formatTimer(hud.time)}</strong>
        </div>
        <div className="card hud-item">
          <span>WPM</span>
          <strong>{hud.wpm}</strong>
        </div>
        <div className="card hud-item">
          <span>Accuracy</span>
          <strong>{hud.accuracy}%</strong>
        </div>
        <div className="card hud-item">
          <span>Errors</span>
          <strong>{currentErrors}</strong>
        </div>
        <div className="card hud-item">
          <span>Streak</span>
          <strong>{streak > 0 ? `🔥 ${streak}` : streak}</strong>
        </div>
        <div className="card hud-item">
          <span>Nitro</span>
          <strong className={hud.nitro.includes("NITRO") ? "nitro-ready" : ""}>{hud.nitro}</strong>
        </div>
      </div>

      <div className="track-wrap">
        <div className="skyline" />
        <div className={`speed-lines ${hud.nitro === "NITRO ON" ? "boost" : ""}`} />
        <div className="road">
          <div className="lane top" />
          <div className="lane bot" />
        </div>
        <div className="bike cpu" style={{ left: `calc(${progress.cpu * 0.72}% + 8px)` }}>
          <Motorcycle variant="cpu" />
        </div>
        <div className="bike player" style={{ left: `calc(${progress.player * 0.72}% + 8px)` }}>
          <Motorcycle variant="player" />
        </div>
      </div>

      <div className="progress-row">
        <div>
          Player {Math.round(progress.player)}%
          <div className="bar player">
            <i style={{ width: `${progress.player}%` }} />
          </div>
        </div>
        <div>
          Opponent {Math.round(progress.cpu)}%
          <div className="bar cpu">
            <i style={{ width: `${progress.cpu}%` }} />
          </div>
        </div>
      </div>

      <section className="card typing-card">
        <div className="typing-header">
          <div className="muted">Topic: {topic?.title}</div>
          <div className="typing-progress">
            <div className="progress-label">Progress</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(100, (typedText.length / (topic?.content.length || 1)) * 100)}%` }}
              />
            </div>
            <div className="progress-text">{Math.round((typedText.length / (topic?.content.length || 1)) * 100)}%</div>
          </div>
        </div>
        {topic && visibleLines.length > 0 && (
          <div className="typing-display" onClick={() => inputRef.current?.focus()}>
            <TypingPanel 
              visibleLines={visibleLines} 
              typedText={typedText}
              lineStartIndex={lineStartIndex}
              fullText={topic.content}
            />
          </div>
        )}
        <input
          ref={inputRef}
          className="race-input"
          aria-label="Typing input"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          placeholder={phase === "racing" ? "Type the passage here..." : "Get ready..."}
          onKeyDown={onKeyDown}
          onChange={(e) => {
            e.target.value = "";
          }}
          onBlur={() => phase === "racing" && inputRef.current?.focus()}
        />
      </section>
    </main>
  );
}

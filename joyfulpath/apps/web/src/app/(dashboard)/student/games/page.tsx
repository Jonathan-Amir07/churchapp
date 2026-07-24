'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardTitle, CardDescription, Button, ProgressBar } from '@/components/ui';
import { useAppStore } from '@/stores/app.store';
import { useNotificationStore } from '@/stores/notifications.store';

// Saint characters for Memory Match Game
const MATCH_CARDS = [
  { id: 'c1', name: 'Noah', icon: 'water_drop', pairId: 'noah' },
  { id: 'c2', name: 'Noah', icon: 'water_drop', pairId: 'noah' },
  { id: 'c3', name: 'Moses', icon: 'splitscreen', pairId: 'moses' },
  { id: 'c4', name: 'Moses', icon: 'splitscreen', pairId: 'moses' },
  { id: 'c5', name: 'David', icon: 'music_note', pairId: 'david' },
  { id: 'c6', name: 'David', icon: 'music_note', pairId: 'david' },
  { id: 'c7', name: 'Daniel', icon: 'pets', pairId: 'daniel' },
  { id: 'c8', name: 'Daniel', icon: 'pets', pairId: 'daniel' },
  { id: 'c9', name: 'Paul', icon: 'mail', pairId: 'paul' },
  { id: 'c10', name: 'Paul', icon: 'mail', pairId: 'paul' },
  { id: 'c11', name: 'Abraham', icon: 'wb_sunny', pairId: 'abraham' },
  { id: 'c12', name: 'Abraham', icon: 'wb_sunny', pairId: 'abraham' },
];

export default function StudentGames() {
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const addToast = useNotificationStore(s => s.addToast);
  
  const { 
    xp, addXP, 
    points, addPoints, 
    readingPlans, toggleChapterRead, 
    memorizedVerses, updateVerseProgress,
    incrementChallenge
  } = useAppStore();

  const [activeHubTab, setActiveHubTab] = useState<'games' | 'reading' | 'memorization'>('games');
  const [activeGame, setActiveGame] = useState<'none' | 'verse_builder' | 'memory_match' | 'guess_saint'>('none');

  // Guess the Saint logic
  const saintClues = [
    { name: 'St. George', clues: ['I was a Roman soldier.', 'I defeated a dragon representing evil.', 'My feast day is celebrated with great joy.'], options: ['St. George', 'St. Mark', 'St. Anthony', 'St. Mina'] },
    { name: 'St. Anthony', clues: ['I am the Father of Monasticism.', 'I went to the Egyptian desert.', 'I fought spiritual battles with prayer.'], options: ['St. Paul the Hermit', 'St. Anthony', 'St. Athanasius', 'St. Bishoy'] }
  ];
  const [saintStep, setSaintStep] = useState(0);
  const [guessFeedback, setGuessFeedback] = useState<string | null>(null);

  // ============================================
  // 1. Verse Builder State & Logic
  // ============================================
  const originalVerse = {
    ref: 'John 3:16',
    text: 'For God so loved the world that he gave his only Son',
    words: ['For', 'God', 'so', 'loved', 'the', 'world', 'that', 'he', 'gave', 'his', 'only', 'Son']
  };

  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [verseCompleted, setVerseCompleted] = useState(false);

  // Scramble words on mount or game reset
  const initVerseBuilder = () => {
    const scrambled = [...originalVerse.words].sort(() => Math.random() - 0.5);
    setScrambledWords(scrambled);
    setSelectedWords([]);
    setVerseCompleted(false);
  };

  const selectWord = (word: string, index: number) => {
    const nextSelected = [...selectedWords, word];
    setSelectedWords(nextSelected);
    
    // Remove one instance of the selected word from scrambled
    const nextScrambled = [...scrambledWords];
    nextScrambled.splice(index, 1);
    setScrambledWords(nextScrambled);

    // Check progress
    if (nextSelected.length === originalVerse.words.length) {
      const parsedText = nextSelected.join(' ');
      if (parsedText.toLowerCase() === originalVerse.text.toLowerCase()) {
        setVerseCompleted(true);
        addXP(20);
        addPoints(5);
        // Daily challenge increment (counts as game completion)
        incrementChallenge('daily', 1);
        addToast('Verse Builder Complete! You earned +20 XP and +5 Points!', 'success');
      } else {
        addToast('Oops, the order is incorrect. Let\'s try again!', 'error');
        initVerseBuilder();
      }
    }
  };

  // ============================================
  // 2. Memory Match State & Logic
  // ============================================
  const [shuffledCards, setShuffledCards] = useState<any[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [movesCount, setMovesCount] = useState(0);

  const initMemoryMatch = () => {
    const shuffled = [...MATCH_CARDS].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setFlippedIndexes([]);
    setMatchedPairs([]);
    setMovesCount(0);
  };

  const handleCardClick = (index: number) => {
    if (flippedIndexes.length === 2 || matchedPairs.includes(shuffledCards[index].pairId) || flippedIndexes.includes(index)) return;

    const nextFlipped = [...flippedIndexes, index];
    setFlippedIndexes(nextFlipped);

    if (nextFlipped.length === 2) {
      setMovesCount((prev) => prev + 1);
      const card1 = shuffledCards[nextFlipped[0]];
      const card2 = shuffledCards[nextFlipped[1]];

      if (card1.pairId === card2.pairId) {
        setMatchedPairs((prev) => [...prev, card1.pairId]);
        setFlippedIndexes([]);
      } else {
        setTimeout(() => {
          setFlippedIndexes([]);
        }, 1000);
      }
    }
  };

  // Check memory game complete
  useEffect(() => {
    if (matchedPairs.length === 6 && shuffledCards.length > 0) {
      setTimeout(() => {
        addXP(30);
        addPoints(8);
        incrementChallenge('daily', 1);
        addToast(`Congratulations! You solved the Memory Match in ${movesCount} moves! Earned +30 XP and +8 Points!`, 'success');
        setActiveGame('none');
      }, 500);
    }
  }, [matchedPairs]);

  // Handle active game initialization
  const startVerseBuilder = () => {
    initVerseBuilder();
    setActiveGame('verse_builder');
  };

  const startMemoryMatch = () => {
    initMemoryMatch();
    setActiveGame('memory_match');
  };

  return (
    <div className="space-y-6 animate-[slide-up_0.4s_ease-out]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            {tNav('games')}
          </h1>
          <p className="text-on-surface-variant text-sm">
            Play games to sharpen your biblical knowledge, track your reading progress, and memorize verses.
          </p>
        </div>
      </div>

      {/* Hub Tabs */}
      <div className="flex border-b border-outline-variant">
        <button
          onClick={() => { setActiveHubTab('games'); setActiveGame('none'); }}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeHubTab === 'games'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">sports_esports</span>
          Games Hub
        </button>
        <button
          onClick={() => setActiveHubTab('reading')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeHubTab === 'reading'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          Reading Tracker
        </button>
        <button
          onClick={() => setActiveHubTab('memorization')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeHubTab === 'memorization'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">bookmark</span>
          Verse Memorization
        </button>
      </div>

      {/* Content Render */}
      {activeHubTab === 'games' && (
        <div className="space-y-6">
          {activeGame === 'none' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Verse Builder */}
              <Card variant="interactive" className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                    <span className="material-symbols-outlined text-[28px]">format_list_numbered</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-on-surface">Verse Builder</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Rearrange the words of the scrambled Bible verses into their correct biblical sequence.
                    </p>
                  </div>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button variant="primary" fullWidth size="md" onClick={startVerseBuilder}>
                    Play Verse Builder (+20 XP)
                  </Button>
                </div>
              </Card>

              {/* Card Memory Match */}
              <Card variant="interactive" className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
                    <span className="material-symbols-outlined text-[28px]">grid_view</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-on-surface">Saints Memory Match</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Flip cards and find matches of historical Saints, Apostles, and Prophets.
                    </p>
                  </div>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button variant="success" fullWidth size="md" onClick={startMemoryMatch}>
                    Play Memory Match (+30 XP)
                  </Button>
                </div>
              </Card>

              {/* Card Guess the Saint / Who Am I? */}
              <Card variant="interactive" className="border border-outline-variant bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                    <span className="material-symbols-outlined text-[28px]">help_center</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-on-surface">Guess the Saint (Who Am I?)</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Read spiritual clues and identify the historical Coptic Saint or Patriarch.
                    </p>
                  </div>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button variant="outline" fullWidth size="md" className="border-purple-300 text-purple-700 hover:bg-purple-50" onClick={() => { setSaintStep(0); setGuessFeedback(null); setActiveGame('guess_saint'); }}>
                    Play Guess the Saint (+25 XP)
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Render Verse Builder Active Game */}
          {activeGame === 'verse_builder' && (
            <Card className="border border-outline-variant bg-surface-container-lowest shadow-md max-w-2xl mx-auto">
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-outline-variant/60">
                  <h3 className="text-base font-extrabold text-on-surface">Verse Builder: {originalVerse.ref}</h3>
                  <Button variant="outline" size="sm" className="h-8 text-xs font-bold" onClick={() => setActiveGame('none')}>
                    Exit Game
                  </Button>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-on-surface-variant">Arrange target order below:</span>
                  <div className="min-h-16 p-4 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low flex flex-wrap gap-2 items-center">
                    {selectedWords.map((word, idx) => (
                      <span key={idx} className="bg-primary text-on-primary px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-on-surface-variant">Tap words in order:</span>
                  <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/60">
                    {scrambledWords.map((word, index) => (
                      <button
                        key={index}
                        onClick={() => selectWord(word, index)}
                        className="py-1.5 px-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant/40 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-3 border-t border-outline-variant/40">
                  <Button variant="outline" size="sm" className="h-9 px-4 text-xs" onClick={initVerseBuilder}>
                    Reset Board
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Render Memory Match Active Game */}
          {activeGame === 'memory_match' && (
            <Card className="border border-outline-variant bg-surface-container-lowest shadow-md max-w-md mx-auto">
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-outline-variant/60">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-extrabold text-on-surface">Saints Memory Match</h3>
                    <p className="text-[10px] text-on-surface-variant font-bold">Moves: {movesCount} | Matches: {matchedPairs.length}/6</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs font-bold" onClick={() => setActiveGame('none')}>
                    Exit Game
                  </Button>
                </div>

                {/* Match Grid */}
                <div className="grid grid-cols-4 gap-3">
                  {shuffledCards.map((card, index) => {
                    const isFlipped = flippedIndexes.includes(index) || matchedPairs.includes(card.pairId);
                    
                    return (
                      <button
                        key={card.id + '-' + index}
                        onClick={() => handleCardClick(index)}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 font-extrabold text-xs select-none ${
                          isFlipped
                            ? 'bg-teal-50 border-teal-200 text-teal-700 rotate-0'
                            : 'bg-primary border-primary/20 text-on-primary hover:scale-[1.03] active:scale-95 shadow-md'
                        }`}
                      >
                        {isFlipped ? (
                          <>
                            <span className="material-symbols-outlined text-[24px] mb-1">{card.icon}</span>
                            <span>{card.name}</span>
                          </>
                        ) : (
                          <span className="material-symbols-outlined text-[32px]">help</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3 justify-end pt-3 border-t border-outline-variant/60">
                  <Button variant="outline" size="sm" className="h-9 px-4 text-xs" onClick={initMemoryMatch}>
                    Reset Grid
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Render Guess the Saint Active Game */}
          {activeGame === 'guess_saint' && (
            <Card className="border border-outline-variant bg-surface-container-lowest shadow-md max-w-lg mx-auto">
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-outline-variant/60">
                  <h3 className="text-base font-extrabold text-on-surface">Who Am I? (Saint #{saintStep + 1})</h3>
                  <Button variant="outline" size="sm" className="h-8 text-xs font-bold" onClick={() => setActiveGame('none')}>
                    Exit Game
                  </Button>
                </div>

                <div className="space-y-3 bg-purple-50 dark:bg-purple-950/20 p-4 rounded-xl border border-purple-200 dark:border-purple-900">
                  <span className="text-xs font-black uppercase text-purple-700 dark:text-purple-300">Clues:</span>
                  <ul className="list-disc list-inside text-sm text-on-surface space-y-1 font-medium">
                    {saintClues[saintStep].clues.map((clue, idx) => (
                      <li key={idx}>{clue}</li>
                    ))}
                  </ul>
                </div>

                {guessFeedback ? (
                  <div className="text-center space-y-3">
                    <p className="text-base font-black text-emerald-600">{guessFeedback}</p>
                    {saintStep < saintClues.length - 1 ? (
                      <Button variant="primary" size="sm" onClick={() => { setSaintStep(s => s + 1); setGuessFeedback(null); }}>
                        Next Saint
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setActiveGame('none')}>
                        Finish Game
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {saintClues[saintStep].options.map((opt, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="md"
                        className="rounded-xl font-bold"
                        onClick={() => {
                          if (opt === saintClues[saintStep].name) {
                            addXP(25);
                            addPoints(5);
                            setGuessFeedback(`Correct! It's ${opt}! (+25 XP)`);
                          } else {
                            addToast('Not quite! Try another guess.', 'error');
                          }
                        }}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Hub Tabs: Bible Reading Tracker */}
      {activeHubTab === 'reading' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {readingPlans.map((plan) => {
            const completedCount = plan.chapters.filter((c) => c.read).length;
            const progressPct = (completedCount / plan.chapters.length) * 100;
            
            return (
              <Card key={plan.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-extrabold text-on-surface leading-tight">
                        {plan.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant font-bold">
                        Reward: +{plan.xpReward} XP upon full completion
                      </p>
                    </div>
                    {plan.completed && (
                      <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 uppercase select-none">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Plan Finished
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
                      <span>Chapters Read</span>
                      <span>{completedCount} / {plan.chapters.length}</span>
                    </div>
                    <ProgressBar value={progressPct} size="md" />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-outline-variant/40">
                    <span className="text-xs font-bold text-on-surface-variant block mb-1">Chapters Checklist:</span>
                    <div className="flex flex-wrap gap-2.5">
                      {plan.chapters.map((ch, idx) => (
                        <button
                          key={idx}
                          onClick={() => toggleChapterRead(plan.id, ch.book, ch.chapter)}
                          className={`py-1.5 px-3 rounded-xl border text-xs font-black transition-all flex items-center gap-1.5 ${
                            ch.read
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                              : 'bg-surface-container-lowest border-outline-variant hover:bg-surface-container text-on-surface'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {ch.read ? 'check_box' : 'check_box_outline_blank'}
                          </span>
                          {ch.book} {ch.chapter}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Hub Tabs: Verse Memorization */}
      {activeHubTab === 'memorization' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {memorizedVerses.map((verse) => (
            <Card key={verse.id} className="border border-outline-variant bg-surface-container-lowest shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">bookmark</span>
                      {verse.reference}
                    </h3>
                  </div>
                  {verse.isMastered && (
                    <span className="bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:yellow-400 border border-yellow-200 dark:border-yellow-900/50 px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 uppercase select-none">
                      <span className="material-symbols-outlined text-[14px]">star</span>
                      Mastered
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-3">
                  <p className="text-sm font-semibold text-on-surface leading-relaxed">
                    {verse.text}
                  </p>
                  <p className="text-sm font-semibold text-on-surface-variant leading-relaxed text-right border-t border-outline-variant/30 pt-2.5" dir="rtl">
                    {verse.textAr}
                  </p>
                </div>

                {/* Slider */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant">
                    <span>Memorization Confidence Level</span>
                    <span>{verse.progress}%</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={verse.progress}
                      onChange={(e) => {
                        const nextProg = Number(e.target.value);
                        updateVerseProgress(verse.id, nextProg);
                        if (nextProg === 100 && !verse.isMastered) {
                          addXP(25);
                          addPoints(5);
                          addToast(`Awesome! You mastered "${verse.reference}"! Earned +25 XP and +5 Points!`, 'success');
                        }
                      }}
                      className="flex-1 accent-primary h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs font-extrabold text-on-surface">{verse.progress === 100 ? 'Mastered' : verse.progress === 0 ? 'Not Started' : 'Learning'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'messages', 'en.json');
const arPath = path.join(__dirname, 'messages', 'ar.json');

let enContent = fs.readFileSync(enPath, 'utf8');
let arContent = fs.readFileSync(arPath, 'utf8');

const enReplacements = [
  { regex: /\bInstructor\b/g, replacement: 'Servant' },
  { regex: /\bInstructors\b/g, replacement: 'Servants' },
  { regex: /\binstructor\b/g, replacement: 'servant' },
  { regex: /\binstructors\b/g, replacement: 'servants' },
  { regex: /\bStudent\b/g, replacement: 'Child' },
  { regex: /\bStudents\b/g, replacement: 'Children' },
  { regex: /\bstudent\b/g, replacement: 'child' },
  { regex: /\bstudents\b/g, replacement: 'children' },
  { regex: /\bLesson\b/g, replacement: 'Sunday School Lesson' },
  { regex: /\bLessons\b/g, replacement: 'Sunday School Lessons' },
  { regex: /\blesson\b/g, replacement: 'sunday school lesson' },
  { regex: /\blessons\b/g, replacement: 'sunday school lessons' },
  { regex: /\bChallenge\b/g, replacement: 'Spiritual Challenge' },
  { regex: /\bChallenges\b/g, replacement: 'Spiritual Challenges' },
  { regex: /\bchallenge\b/g, replacement: 'spiritual challenge' },
  { regex: /\bchallenges\b/g, replacement: 'spiritual challenges' },
  { regex: /\bReward\b/g, replacement: 'Blessing' },
  { regex: /\bRewards\b/g, replacement: 'Blessings' },
  { regex: /\breward\b/g, replacement: 'blessing' },
  { regex: /\brewards\b/g, replacement: 'blessings' },
  { regex: /\bAchievement\b/g, replacement: 'Spiritual Achievement' },
  { regex: /\bAchievements\b/g, replacement: 'Spiritual Achievements' },
  { regex: /\bachievement\b/g, replacement: 'spiritual achievement' },
  { regex: /\bachievements\b/g, replacement: 'spiritual achievements' }
];

const arReplacements = [
  { regex: /معلم/g, replacement: 'خادم' },
  { regex: /معلمون/g, replacement: 'خدام' },
  { regex: /معلمين/g, replacement: 'خدام' },
  { regex: /طالب/g, replacement: 'مخدوم' },
  { regex: /طلاب/g, replacement: 'مخدومين' },
  { regex: /درس/g, replacement: 'درس مدارس الأحد' },
  { regex: /دروس/g, replacement: 'دروس مدارس الأحد' },
  { regex: /تحدي/g, replacement: 'تحدي روحي' },
  { regex: /تحديات/g, replacement: 'تحديات روحية' },
  { regex: /مكافأة/g, replacement: 'بركة' },
  { regex: /مكافآت/g, replacement: 'بركات' },
  { regex: /إنجاز/g, replacement: 'إنجاز روحي' },
  { regex: /إنجازات/g, replacement: 'إنجازات روحية' }
];

// Deep replace only string values in json object
function traverseAndReplace(obj, replacements) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      let val = obj[key];
      replacements.forEach(r => {
        val = val.replace(r.regex, r.replacement);
      });
      obj[key] = val;
    } else if (typeof obj[key] === 'object') {
      traverseAndReplace(obj[key], replacements);
    }
  }
}

const enObj = JSON.parse(enContent);
traverseAndReplace(enObj, enReplacements);
fs.writeFileSync(enPath, JSON.stringify(enObj, null, 2));

const arObj = JSON.parse(arContent);
traverseAndReplace(arObj, arReplacements);
fs.writeFileSync(arPath, JSON.stringify(arObj, null, 2));

console.log("Terminology updated successfully in en.json and ar.json");

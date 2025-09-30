import { useState, useEffect, type ChangeEvent } from 'react';
import { groups } from './data/groups';

interface FormData {
  liveDate: string;
  dateFormat: string;
  liveTitle: string;
  livePlace: string;
  livePlacePrefix: string;
  group: string;
  selectedMembers: string[];
  honorific: string;
  hashtags: string;
  addMemberNameToHashtag: boolean;
  reverseAccountHonorific: boolean;
  useParenthesesForAccount: boolean;
}

const getInitialState = (): FormData => {
  const defaults: FormData = {
    liveDate: '',
    dateFormat: 'YYYY/MM/DD',
    liveTitle: '',
    livePlace: '',
    livePlacePrefix: '@',
    group: 'イコラブ',
    selectedMembers: [],
    honorific: 'さん',
    hashtags: '',
    addMemberNameToHashtag: false,
    reverseAccountHonorific: false,
    useParenthesesForAccount: true,
  };

  try {
    const savedData = localStorage.getItem('idolPostGenerator');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return { ...defaults, ...parsedData };
    }
  } catch (error) {
    console.error('Error parsing saved data from localStorage', error);
    return defaults;
  }

  return defaults;
};

function App() {
  const [formData, setFormData] = useState<FormData>(getInitialState);
  const [generatedText, setGeneratedText] = useState('');

  const handleGroupChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value, selectedMembers: [] }));
    // GA4イベント送信
    if (window.gtag) {
      window.gtag('event', 'select_group', {
        group_name: value,
      });
    }
  };

  const handleMemberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newSelectedMembers = checked
        ? [...prev.selectedMembers, value]
        : prev.selectedMembers.filter((name) => name !== value);

      // GA4イベント送信
      if (window.gtag) {
        window.gtag('event', checked ? 'select_member' : 'deselect_member', {
          group_name: prev.group,
          member_name: value,
        });
      }

      return { ...prev, selectedMembers: newSelectedMembers };
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFormData((prev) => ({
      ...prev,
      [id]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  useEffect(() => {
    localStorage.setItem('idolPostGenerator', JSON.stringify(formData));

    const {
      liveDate,
      dateFormat,
      liveTitle,
      livePlace,
      livePlacePrefix,
      group,
      selectedMembers,
      honorific,
      hashtags,
      addMemberNameToHashtag,
      reverseAccountHonorific,
      useParenthesesForAccount,
    } = formData;

    const formatDate = (dateStr: string, format: string): string => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      return format
        .replace(/YYYY/g, String(year))
        .replace(/MM/g, String(month).padStart(2, '0'))
        .replace(/DD/g, String(day).padStart(2, '0'));
    };

    const createHashtags = (tags: string): string => {
      const groupInfo = groups[group];
      let groupBasedHashtag = '';
      if (group) {
        if (groupInfo.disableCamekoHashtag) {
          groupBasedHashtag = `#${group}`;
        } else {
          groupBasedHashtag = `#${group}_カメコ`;
        }
      }

      const userHashtags = tags
        .split(/[,\s]+/)
        .filter((tag) => tag)
        .map((tag) => `#${tag}`)
        .join(' ');
      const memberNameHashtags = addMemberNameToHashtag
        ? selectedMembers.map((name) => `#${name.replace(/\s/g, '')}`)
        : [];

      const specificMemberHashtags = selectedMembers
        .map((name) => {
          const memberInfo = groups[group].members.find((m) => m.name === name);
          return memberInfo?.specificHashtag
            ? `#${memberInfo.specificHashtag}`
            : null;
        })
        .filter((tag): tag is string => tag !== null);

      const allMemberHashtags = Array.from(
        new Set([...specificMemberHashtags, ...memberNameHashtags]),
      ).join(' ');

      return [groupBasedHashtag, userHashtags, allMemberHashtags]
        .filter(Boolean)
        .join(' ');
    };

    const membersText = selectedMembers
      .map((name) => {
        const memberInfo = groups[group].members.find((m) => m.name === name);
        if (memberInfo) {
          const account = useParenthesesForAccount
            ? `(@${memberInfo.account})`
            : `@${memberInfo.account}`;
          const namePart = memberInfo.name;

          if (reverseAccountHonorific) {
            return `${namePart}${honorific} ${account}`;
          }
          return `${namePart} ${account}${honorific}`;
        }
        return `${name}${honorific}`;
      })
      .join('\n');

    const text =
      `\n${formatDate(liveDate, dateFormat)}\n${liveTitle}\n${livePlacePrefix} ${livePlace}\n\n${membersText}\n\n${createHashtags(hashtags)}\n    `.trim();
    setGeneratedText(text);
  }, [formData]);

  const handleCopyClipBoard = () => {
    navigator.clipboard.writeText(generatedText);
    // GA4イベント送信
    if (window.gtag) {
      window.gtag('event', 'copy_to_clipboard');
    }
  };

  const handlePostToX = () => {
    const encodedText = encodeURIComponent(generatedText);
    window.open(
      `https://x.com/intent/tweet?text=${encodedText}`,
      '_blank',
      'noopener,noreferrer',
    );
    // GA4イベント送信
    if (window.gtag) {
      window.gtag('event', 'post_to_x');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 fs-4">カメコ投稿テンプレート生成器</h1>
      <div className="row">
        <div className="col-md-5">
          <div className="mb-3">
            <label htmlFor="liveDate" className="form-label">
              日付
            </label>
            <input
              type="date"
              className="form-control"
              id="liveDate"
              value={formData.liveDate}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="dateFormat" className="form-label">
              日付フォーマット
            </label>
            <select
              className="form-select"
              id="dateFormat"
              value={formData.dateFormat}
              onChange={handleChange}
            >
              <option value="YYYY/MM/DD">YYYY/MM/DD</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="YYYY.MM.DD">YYYY.MM.DD</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="liveTitle" className="form-label">
              ライブタイトル
            </label>
            <input
              type="text"
              className="form-control"
              id="liveTitle"
              value={formData.liveTitle}
              onChange={handleChange}
            />
          </div>
          <fieldset className="mb-3">
            <legend className="form-label">場所</legend>
            <label htmlFor="livePlacePrefix" className="form-label sr-only">
              場所の形式
            </label>
            <select
              className="form-select mb-2"
              id="livePlacePrefix"
              value={formData.livePlacePrefix}
              onChange={handleChange}
              style={{ width: '100px' }}
            >
              <option value="@">@</option>
              <option value="in">in</option>
              <option value="📍">📍</option>
            </select>
            <input
              type="text"
              className="form-control"
              id="livePlace"
              placeholder="会場名など"
              value={formData.livePlace}
              onChange={handleChange}
            />
          </fieldset>
          <div className="mb-3">
            <label htmlFor="group" className="form-label">
              グループ
            </label>
            <select
              className="form-select"
              id="group"
              value={formData.group}
              onChange={handleGroupChange}
            >
              {Object.keys(groups).map((groupName) => (
                <option key={groupName} value={groupName}>
                  {groupName}
                </option>
              ))}
            </select>
          </div>
          <fieldset className="mb-3">
            <legend className="form-label">メンバー</legend>
            <div
              style={{
                maxHeight: '350px',
                overflowY: 'auto',
                border: '1px solid #ced4da',
                padding: '10px',
                borderRadius: '5px',
              }}
            >
              {groups[formData.group].members.map((member) => (
                <div key={member.name} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={member.name}
                    id={`member-${member.name}`}
                    checked={formData.selectedMembers.includes(member.name)}
                    onChange={handleMemberChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`member-${member.name}`}
                  >
                    {member.name}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="addMemberNameToHashtag"
              checked={formData.addMemberNameToHashtag}
              onChange={handleChange}
            />
            <label
              className="form-check-label"
              htmlFor="addMemberNameToHashtag"
            >
              ハッシュタグにメンバー名を追加する
            </label>
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="reverseAccountHonorific"
              checked={formData.reverseAccountHonorific}
              onChange={handleChange}
            />
            <label
              className="form-check-label"
              htmlFor="reverseAccountHonorific"
            >
              敬称とXアカウントを逆にする
            </label>
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="useParenthesesForAccount"
              checked={formData.useParenthesesForAccount}
              onChange={handleChange}
            />
            <label
              className="form-check-label"
              htmlFor="useParenthesesForAccount"
            >
              Xアカウントを()で囲う
            </label>
          </div>
          <div className="mb-3">
            <label htmlFor="honorific" className="form-label">
              敬称
            </label>
            <select
              className="form-select"
              id="honorific"
              value={formData.honorific}
              onChange={handleChange}
            >
              <option value="さん">さん</option>
              <option value="ちゃん">ちゃん</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="hashtags" className="form-label">
              追加ハッシュタグ (スペースかカンマ区切り)
            </label>
            <input
              type="text"
              className="form-control"
              id="hashtags"
              value={formData.hashtags}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-7">
          <h2 className="fs-4" id="generated-post-title">
            生成された投稿
          </h2>
          <div className="mb-3">
            <textarea
              className="form-control"
              style={{ height: '250px' }}
              value={generatedText}
              readOnly
              aria-labelledby="generated-post-title"
            />
          </div>
          <div className="d-flex justify-content-between mb-5">
            <button
              className="btn btn-outline-primary me-2"
              onClick={handleCopyClipBoard}
            >
              クリップボードにコピー
            </button>
            <button
              className="btn btn-info flex-grow-1"
              onClick={handlePostToX}
            >
              Xにポスト
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

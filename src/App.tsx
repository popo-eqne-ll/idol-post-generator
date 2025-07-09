import { useState, useEffect, type ChangeEvent } from 'react';

interface Member {
  name: string;
  account: string;
}

const groups: Record<string, Member[]> = {
  'イコラブ': [
    { name: '大谷 映美里', account: 'otani_emiri' },
    { name: '大場 花菜', account: 'oba_hana_' },
    { name: '音嶋 莉沙', account: 'otoshima_risa' },
    { name: '齋藤 樹愛羅', account: 'saitou_kiara' },
    { name: '佐々木 舞香', account: 'sasaki_maika' },
    { name: '髙松 瞳', account: 'takamatsuhitomi' },
    { name: '瀧脇 笙古', account: 'takiwaki_shoko_' },
    { name: '野口 衣織', account: 'noguchi_iori' },
    { name: '諸橋 沙夏', account: 'morohashi_sana' },
    { name: '山本 杏奈', account: 'yamamoto_anna_' },
  ],
  'ノイミー': [
    { name: '尾木 波菜', account: 'ogi_hana_' },
    { name: '落合 希来里', account: 'ochiai_kirari_' },
    { name: '蟹沢 萌子', account: 'kanisawa_moeko_' },
    { name: '河口 夏音', account: 'kawaguchi_natsu' },
    { name: '川中子 奈月心', account: 'kawanagonatsumi' },
    { name: '櫻井 もも', account: 'sakurai_momo_' },
    { name: '菅波 美玲', account: 'suganami_mirei_' },
    { name: '鈴木 瞳美', account: 'suzuki_hitomi_' },
    { name: '谷崎 早耶', account: 'tanizaki_saya_' },
    { name: '冨田 菜々風', account: 'tomita_nanaka_' },
    { name: '永田 詩央里', account: 'nagata_shiori_' },
    { name: '本田 珠由記', account: 'honda_miyuki_' },
  ],
  'ニアジョイ': [
    { name: '逢田 珠里依', account: 'aida_jurii' },
    { name: '天野 香乃愛', account: 'amano_konoa' },
    { name: '市原 愛弓', account: 'ichihara_ayumi_' },
    { name: '江角 怜音', account: 'esumi_renon' },
    { name: '大信田 美月', account: 'oshida_mitsuki' },
    { name: '大西 葵', account: 'onishi_aoi' },
    { name: '小澤 愛実', account: 'ozawa_aimi__' },
    { name: '髙橋 舞', account: 'takahashi_mai__' },
    { name: '藤沢 莉子', account: 'fujisawa_riko' },
    { name: '村山 結香', account: 'murayama_yuuka' },
    { name: '山田 杏佳', account: 'yamada_momoka_' },
    { name: '山野 愛月', account: 'yamano_arisu' },
  ],
};

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
  membersAsHashtags: boolean;
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
    membersAsHashtags: false,
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
    console.error("Error parsing saved data from localStorage", error);
    return defaults;
  }

  return defaults;
};

function App() {
  const [formData, setFormData] = useState<FormData>(getInitialState);
  const [generatedText, setGeneratedText] = useState('');

  const handleGroupChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value, selectedMembers: [] }));
    // GA4イベント送信
    if (window.gtag) {
      window.gtag('event', 'select_group', {
        group_name: value,
      });
    }
  };

  const handleMemberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const newSelectedMembers = checked
        ? [...prev.selectedMembers, value]
        : prev.selectedMembers.filter(name => name !== value);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFormData(prev => ({ ...prev, [id]: isCheckbox ? (e.target as HTMLInputElement).checked : value }));
  };

  useEffect(() => {
    localStorage.setItem('idolPostGenerator', JSON.stringify(formData));

    const { liveDate, dateFormat, liveTitle, livePlace, livePlacePrefix, group, selectedMembers, honorific, hashtags, membersAsHashtags, reverseAccountHonorific, useParenthesesForAccount } = formData;

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
      const groupHashtag = group ? `#${group}` : '';
      const groupCamekoHashtag = group ? `#${group}_カメコ` : '';
      const userHashtags = tags.split(/[,\s]+/).filter(tag => tag).map(tag => `#${tag}`).join(' ');
      return [groupHashtag, groupCamekoHashtag, userHashtags].filter(Boolean).join(' ');
    }

    const membersText = selectedMembers.map(name => {
        const memberInfo = groups[group].find(m => m.name === name);
        if (memberInfo) {
            const account = useParenthesesForAccount ? `(@${memberInfo.account})` : `@${memberInfo.account}`;
            let namePart = memberInfo.name;
            if (membersAsHashtags) {
                namePart = `#${memberInfo.name.replace(/\s/g, '')}`;
            }

            if (reverseAccountHonorific) {
                if (membersAsHashtags) {
                    return `${namePart} ${honorific} ${account}`;
                }
                return `${namePart}${honorific} ${account}`;
            }
            return `${namePart} ${account}${honorific}`;
        }
        return `${name}${honorific}`;
    }).join('\n');

    const text = `\n${formatDate(liveDate, dateFormat)}\n${liveTitle}\n${livePlacePrefix} ${livePlace}\n\n${membersText}\n\n${createHashtags(hashtags)}\n    `.trim();
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
    window.open(`https://x.com/intent/tweet?text=${encodedText}`, '_blank');
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
            <label htmlFor="liveDate" className="form-label">日付</label>
            <input type="date" className="form-control" id="liveDate" value={formData.liveDate} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="dateFormat" className="form-label">日付フォーマット</label>
            <select className="form-select" id="dateFormat" value={formData.dateFormat} onChange={handleChange}>
              <option value="YYYY/MM/DD">YYYY/MM/DD</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="YYYY.MM.DD">YYYY.MM.DD</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="liveTitle" className="form-label">ライブタイトル</label>
            <input type="text" className="form-control" id="liveTitle" value={formData.liveTitle} onChange={handleChange} />
          </div>
          <fieldset className="mb-3">
            <legend className="form-label">場所</legend>
            <select className="form-select mb-2" id="livePlacePrefix" value={formData.livePlacePrefix} onChange={handleChange} style={{ width: '100px' }}>
              <option value="@">@</option>
              <option value="in">in</option>
              <option value="📍">📍</option>
            </select>
            <input type="text" className="form-control" id="livePlace" placeholder="会場名など" value={formData.livePlace} onChange={handleChange} />
          </fieldset>
          <div className="mb-3">
            <label htmlFor="group" className="form-label">グループ</label>
            <select className="form-select" id="group" value={formData.group} onChange={handleGroupChange}>
              {Object.keys(groups).map(groupName => (
                <option key={groupName} value={groupName}>{groupName}</option>
              ))}
            </select>
          </div>
          <fieldset className="mb-3">
            <legend className="form-label">メンバー</legend>
            <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid #ced4da', padding: '10px', borderRadius: '5px' }}>
              {groups[formData.group].map(member => (
                <div key={member.name} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={member.name}
                    id={`member-${member.name}`}
                    checked={formData.selectedMembers.includes(member.name)}
                    onChange={handleMemberChange}
                  />
                  <label className="form-check-label" htmlFor={`member-${member.name}`}>
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
              id="membersAsHashtags"
              checked={formData.membersAsHashtags}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="membersAsHashtags">
              メンバー名をハッシュタグにする
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
            <label className="form-check-label" htmlFor="reverseAccountHonorific">
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
            <label className="form-check-label" htmlFor="useParenthesesForAccount">
              Xアカウントを()で囲う
            </label>
          </div>
          <div className="mb-3">
            <label htmlFor="honorific" className="form-label">敬称</label>
            <select className="form-select" id="honorific" value={formData.honorific} onChange={handleChange}>
              <option value="さん">さん</option>
              <option value="ちゃん">ちゃん</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="hashtags" className="form-label">追加ハッシュタグ (スペースかカンマ区切り)</label>
            <input type="text" className="form-control" id="hashtags" value={formData.hashtags} onChange={handleChange} />
          </div>
        </div>
        <div className="col-md-7">
          <h2 className="fs-4" id="generated-post-title">生成された投稿</h2>
          <div className="mb-3">
            <textarea className="form-control" style={{height: "250px"}} value={generatedText} readOnly aria-labelledby="generated-post-title" />
          </div>
          <div className="d-flex justify-content-between mb-5">
            <button className="btn btn-outline-primary me-2" onClick={handleCopyClipBoard}>クリップボードにコピー</button>
            <button className="btn btn-info flex-grow-1" onClick={handlePostToX}>Xにポスト</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

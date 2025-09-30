interface Member {
  name: string;
  account: string;
  url: string;
  specificHashtag?: string;
}

interface GroupInfo {
  members: Member[];
  disableCamekoHashtag?: boolean;
}

export const groups: Record<string, GroupInfo> = {
  イコラブ: {
    members: [
      {
        name: '大谷 映美里',
        account: 'otani_emiri',
        url: 'https://x.com/otani_emiri',
      },
      { name: '大場 花菜', account: 'hana_oba', url: 'https://x.com/hana_oba' },
      {
        name: '音嶋 莉沙',
        account: 'otoshima_risa',
        url: 'https://x.com/otoshima_risa',
      },
      {
        name: '齋藤 樹愛羅',
        account: 'saitou_kiara',
        url: 'https://x.com/saitou_kiara',
      },
      {
        name: '佐々木 舞香',
        account: 'sasaki_maika',
        url: 'https://x.com/sasaki_maika',
      },
      {
        name: '髙松 瞳',
        account: 'takamatsuhitomi',
        url: 'https://x.com/takamatsuhitomi',
      },
      {
        name: '瀧脇 笙古',
        account: 'shoko_takiwaki',
        url: 'https://x.com/shoko_takiwaki',
      },
      {
        name: '野口 衣織',
        account: 'noguchi_iori',
        url: 'https://x.com/noguchi_iori',
      },
      {
        name: '諸橋 沙夏',
        account: 'morohashi_sana',
        url: 'https://x.com/morohashi_sana',
      },
      {
        name: '山本 杏奈',
        account: 'yamamoto_anna_',
        url: 'https://x.com/yamamoto_anna_',
      },
    ],
  },
  ノイミー: {
    members: [
      {
        name: '尾木 波菜',
        account: 'ogi_hana_',
        url: 'https://x.com/ogi_hana_',
      },
      {
        name: '落合 希来里',
        account: 'ochiai_kirari',
        url: 'https://x.com/ochiai_kirari',
      },
      {
        name: '蟹沢 萌子',
        account: 'kanisawa_moeko',
        url: 'https://x.com/kanisawa_moeko',
      },
      {
        name: '河口 夏音',
        account: 'kawaguchi_natsu',
        url: 'https://x.com/kawaguchi_natsu',
      },
      {
        name: '川中子 奈月心',
        account: 'kawanagonatsumi',
        url: 'https://x.com/kawanagonatsumi',
      },
      {
        name: '櫻井 もも',
        account: '_sakurai_momo_',
        url: 'https://x.com/_sakurai_momo_',
      },
      {
        name: '菅波 美玲',
        account: 'suganami_mirei',
        url: 'https://x.com/suganami_mirei',
      },
      {
        name: '鈴木 瞳美',
        account: 'suzuki_hitomi_',
        url: 'https://x.com/suzuki_hitomi_',
      },
      {
        name: '谷崎 早耶',
        account: 'tanizaki_saya',
        url: 'https://x.com/tanizaki_saya',
      },
      {
        name: '冨田 菜々風',
        account: 'tomita_nanaka',
        url: 'https://x.com/tomita_nanaka',
      },
      {
        name: '永田 詩央里',
        account: 'nagata_shiori_',
        url: 'https://x.com/nagata_shiori_',
      },
      {
        name: '本田 珠由記',
        account: 'honda_miyuki_',
        url: 'https://x.com/honda_miyuki_',
      },
    ],
  },
  ニアジョイ: {
    members: [
      {
        name: '逢田 珠里依',
        account: 'aida_jurii',
        url: 'https://x.com/aida_jurii',
      },
      {
        name: '天野 香乃愛',
        account: 'amano_konoa',
        url: 'https://x.com/amano_konoa',
      },
      {
        name: '市原 愛弓',
        account: 'ichihara_ayumi_',
        url: 'https://x.com/ichihara_ayumi_',
      },
      {
        name: '江角 怜音',
        account: 'esumi_renon',
        url: 'https://x.com/esumi_renon',
      },
      {
        name: '大信田 美月',
        account: 'oshida_mitsuki',
        url: 'https://x.com/oshida_mitsuki',
      },
      {
        name: '大西 葵',
        account: 'onishi_aoi',
        url: 'https://x.com/onishi_aoi',
      },
      {
        name: '小澤 愛実',
        account: 'ozawa_aimi__',
        url: 'https://x.com/ozawa_aimi__',
      },
      {
        name: '髙橋 舞',
        account: 'takahashi_mai__',
        url: 'https://x.com/takahashi_mai__',
      },
      {
        name: '藤沢 莉子',
        account: 'fujisawa_riko',
        url: 'https://x.com/fujisawa_riko',
      },
      {
        name: '村山 結香',
        account: 'murayama_yuuka',
        url: 'https://x.com/murayama_yuuka',
      },
      {
        name: '山田 杏佳',
        account: 'yamada_momoka__',
        url: 'https://x.com/yamada_momoka__',
      },
      {
        name: '山野 愛月',
        account: 'yamano_arisu',
        url: 'https://x.com/yamano_arisu',
      },
    ],
  },
  ルトミ: {
    members: [
      {
        name: '黒嵜 菜々子',
        account: '0516_nanako',
        url: 'https://x.com/0516_nanako',
      },
      {
        name: '反田 葉月',
        account: 'tanda_hazuki',
        url: 'https://x.com/tanda_hazuki',
      },
      {
        name: '貫井 夢生',
        account: 'nuu_00000',
        url: 'https://x.com/nuu_00000',
      },
      {
        name: '小田垣 有咲',
        account: 'ariarisan_0104',
        url: 'https://x.com/ariarisan_0104',
      },
      {
        name: '才川 水希',
        account: 'mi_saikawa',
        url: 'https://x.com/mi_saikawa',
      },
      {
        name: '天宮 さくら',
        account: 'saku___39ra',
        url: 'https://x.com/saku___39ra',
      },
      {
        name: '朝比奈 麗桜',
        account: 'sns_nigatekamo',
        url: 'https://x.com/sns_nigatekamo',
      },
    ],
    disableCamekoHashtag: true,
  },
};

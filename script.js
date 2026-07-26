import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.181.1/build/three.module.js";

    const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
    const STORE_KEY='box_appraisal_connected_v1';
    const BOX_PRICE=200;
    const CATEGORY_REWARD=150;
    const RISK_REWARD=150;
    const MAX_BOXES=15;
    const riskLabel={safe:'안전',warning:'주의',danger:'위험'};
    const chestNames=['나무 상자','은 상자','금 상자','다이아 상자','봉인된 상자'];
    const chestValues=[450,518,585,653,720];
    const palettes=[
      {body:0x765437,panel:0x8a6442,trim:0x373633,accent:0x9e7b52,m:.08,r:.82},
      {body:0x6d7478,panel:0x858b8e,trim:0xb1b4b4,accent:0x494f52,m:.72,r:.34},
      {body:0x96691e,panel:0xaf812c,trim:0xd0a244,accent:0x39352f,m:.65,r:.34},
      {body:0x3f7580,panel:0x548994,trim:0x83b1b8,accent:0x29454b,m:.54,r:.29},
      {body:0x28272a,panel:0x343237,trim:0x555158,accent:0x71586e,m:.46,r:.42}
    ];
    // ==============================
    // 카테고리별 아이템 데이터
    // 위험도: 1~5 위험 / 6~10 주의 / 11~15 안전
    // ==============================
    const itemCatalog={
      mimic:{
        label:'생물',
        items:[
          {name:'슈뢰딩거의 고양이(적응)',description:'후루베 유라유라..',risk:'danger'},
          {name:'코가 긴 길고양이',description:'다라이가 살벌하기 짝이 없습니다',risk:'danger'},
          {name:'담배피는 고양이',description:'호흡기 질환을 유발합니다',risk:'danger'},
          {name:'드래곤',description:'멋있습니다',risk:'danger'},
          {name:'짱룡',description:'테무에서 나왔습니다',risk:'danger'},
          {name:'북극곰',description:'북극이 녹아내릴 때까지',risk:'warning'},
          {name:'마즈',description:'말레이고오옴',risk:'warning'},
          {name:'보노보',description:'거꾸로 해도 보노보',risk:'warning'},
          {name:'성인 남성',description:'왜 들어가 계십니까',risk:'warning'},
          {name:'개발자',description:'나 진짜 팔 거야..?',risk:'warning'},
          {name:'아트팀',description:'살려주세요',risk:'safe'},
          {name:'자라나는 금덩이',description:'쑥쑥 잘 자랍니다',risk:'safe'},
          {name:'슬라임',description:'끄..ㄴ..ㅈ..ㅓ..ㄱ',risk:'safe'},
          {name:'세상에서 가장 귀여운 고양이',description:'귀엽습니다',risk:'safe'},
          {name:'슈뢰딩거의 고양이(생존)',description:'하지만 살았죠?',risk:'safe'}
        ]
      },
      treasure:{
        label:'귀중품',
        items:[
          {name:'수상한 책',description:'수상합니다',risk:'danger'},
          {name:'상속인이 얽힌 집문서',description:'법정의 늪으로',risk:'danger'},
          {name:'하얀색 가루',description:'기분이 좋아집니다',risk:'danger'},
          {name:'콘솔 게임기',description:'사막에서 파헤쳤습니다',risk:'danger'},
          {name:'낡은 왕관',description:'왕은 없지만 왕관은 남았습니다',risk:'danger'},
          {name:'순금 명함',description:'주인을 알 수 없습니다',risk:'warning'},
          {name:'검은 진주',description:'빛을 삼키는 색입니다',risk:'warning'},
          {name:'고장 난 회중시계',description:'시간보다 값이 더 갑니다',risk:'warning'},
          {name:'봉인된 우표첩',description:'편지보다 오래 살아남았습니다',risk:'warning'},
          {name:'오래된 주식 증서',description:'종이 한 장에 희망이 붙어 있습니다',risk:'warning'},
          {name:'출처불명 금덩어리',description:'한때 다른 금덩이의 일부였습니다',risk:'safe'},
          {name:'금화',description:'금으로 만든 화폐입니다',risk:'safe'},
          {name:'가짜처럼 보이는 진짜 다이아몬드',description:'실험실에서 만들어졌습니다',risk:'safe'},
          {name:'비싼 술',description:'언제 마셔도 나쁘지 않습니다',risk:'safe'},
          {name:'두바이쫀득쿠키',description:'쫀득하고 바삭합니다',risk:'safe'}
        ]
      },
      explosive:{
        label:'폭발물',
        items:[
          {name:'알라의 요술봉',description:'붉은 모래, 검은 금',risk:'danger'},
          {name:'뚱뚱한 청년',description:'그림자가 먼저 도착합니다',risk:'danger'},
          {name:'작은 소년',description:'작지만 결코 가볍지 않습니다',risk:'danger'},
          {name:'빨간 풍선 99개',description:'너를 생각하며 날려보낼래',risk:'danger'},
          {name:'거꾸로 가는 시계',description:'시계아닌데~~시계아닌데~~',risk:'danger'},
          {name:'빨간 버튼',description:'보드게임 카페입니다',risk:'warning'},
          {name:'압력식 광산용 뇌관',description:'밟지 않아도 조심하세요',risk:'warning'},
          {name:'다이너마이트',description:'하나, 둘, 셋, 발파!',risk:'warning'},
          {name:'화약 꾸러미',description:'불씨를 가까이하지 마세요',risk:'warning'},
          {name:'LPG가스통',description:'서늘한 곳에 보관하세요',risk:'warning'},
          {name:'불붙은 폭죽',description:'이미 늦었을 수도 있습니다',risk:'safe'},
          {name:'보조 배터리',description:'때때로 터지기도 합니다',risk:'safe'},
          {name:'터질 듯한 풍선',description:'바늘 하나면 끝입니다',risk:'safe'},
          {name:'멘토스와 콜라',description:'조합법이 너무 유명합니다',risk:'safe'},
          {name:'흔들어진 콜라',description:'끈적하고 달콤합니다',risk:'safe'}
        ]
      },
      junk:{
        label:'잡동사니',
        items:[
          {name:'핵폐기물',description:'대체 왜 여기에 있는거죠?',risk:'danger'},
          {name:'끊어진 이어폰',description:'한쪽만 들리던 시절도 끝났습니다',risk:'danger'},
          {name:'빈 통조림',description:'안에는 추억도 없습니다',risk:'danger'},
          {name:'젖은 양말',description:'원인을 알고 싶지 않습니다',risk:'danger'},
          {name:'깨진 우산',description:'비보다 바람에게 졌습니다',risk:'danger'},
          {name:'낡은 리모컨',description:'어느 기기의 것인지 모릅니다',risk:'warning'},
          {name:'단추 한 통',description:'짝을 잃은 것들입니다',risk:'warning'},
          {name:'구겨진 영수증',description:'기억나지 않는 소비의 기록',risk:'warning'},
          {name:'바퀴 하나 없는 의자',description:'앉는 순간 결심하게 됩니다',risk:'warning'},
          {name:'빈 액자',description:'가장 중요한 것이 없습니다',risk:'warning'},
          {name:'고장 난 토스터',description:'빵보다 연기가 먼저 나옵니다',risk:'safe'},
          {name:'정체불명의 케이블',description:'버리면 다음 날 필요해집니다',risk:'safe'},
          {name:'OMR 카드',description:'각자의 이야기가 담긴 수십만의 꿈',risk:'safe'},
          {name:'연필깎이',description:'끝을 뾰족하게 만듭니다',risk:'safe'},
          {name:'일회용 귀마개',description:'언제 어디서나 편안하게',risk:'safe'}
        ]
      }
    };
    // ==============================
    // 한국어 / 일본어 언어 지원
    // ==============================
    let currentLanguage='ko';
    const LANGUAGE_KEY='box_appraisal_language';
    const jaText={
      '상자 감정소':'箱鑑定所','도감':'図鑑','초기화':'初期化','저장 데이터 초기화':'セーブデータを初期化',
      'FORM A-01 · 신규 작업자 등록':'FORM A-01 · 新規作業員登録','업무 인수 확인서':'業務引継確認書',
      '본인은 적재소에서 미감정 상자를 구매하고, 감정소에서 조사 결과를 바탕으로 내용물의 카테고리와 안전성을 판정한 뒤 개봉하는 업무를 인수합니다.':'私は保管所で未鑑定の箱を購入し、鑑定所で調査結果をもとに内容物のカテゴリーと安全性を判定してから開封する業務を引き継ぎます。',
      '상자는 적재소에서 한 개씩 구매하며 최대 15개까지 보관합니다.':'箱は保管所で1個ずつ購入し、最大15個まで保管できます。',
      '보유 상자는 감정소에서 개봉할 때마다 한 개씩 차감됩니다.':'保有している箱は鑑定所で開封するたびに1個ずつ消費されます。',
      '판정 보상으로 얻은 금액은 다음 상자 구매에 다시 사용할 수 있습니다.':'判定報酬で得た資金は次の箱の購入に使用できます。',
      '업무용 도감이 지급되며 조사 단서와 후보 물품을 비교하는 데 사용할 수 있습니다.':'業務用図鑑が支給され、調査の手掛かりと候補品の比較に利用できます。',
      '작업자 서명':'作業員署名','마우스로 이곳에 서명하세요':'マウスでここに署名してください','서명을 마치고 마우스를 떼면 적재소로 이동합니다.':'署名を終えてマウスを離すと保管所へ移動します。',
      '사고,':'買って、','쌓고,':'積んで、','감정한다':'鑑定する',
      '적재소에서 상자를 구매해 보관하고, 감정소에서 상자를 하나씩 꺼내 조사하고 처리합니다. 번 돈으로 다시 상자를 사며 계속 이어집니다.':'保管所で箱を購入して保管し、鑑定所で1箱ずつ調査して処理します。得た資金で次の箱を購入し、業務を続けます。',
      '임무 시작':'業務開始','상자 적재소':'箱保管所','상자 도감':'箱図鑑',
      '보유한 상자를 한 개 꺼내 네 번 조사하고 카테고리와 안전성을 맞힌 뒤 개봉합니다.':'保有中の箱を取り出し、4回調査してカテゴリーと安全性を判定した後に開封します。',
      '돈으로 상자를 구매해 보관합니다. 한 더미에 5개씩, 최대 15개까지 쌓이며 감정소에서 사용됩니다.':'資金で箱を購入して保管します。1列5個、最大15個まで積み上げられ、鑑定所で使用されます。',
      '개봉해서 발견한 물품과 최고 별 등급을 카테고리별로 확인합니다.':'開封して発見した品物と最高星等級をカテゴリー別に確認します。',
      '적재소에서 가져온 상자를 감정합니다.':'保管所から運ばれた箱を鑑定します。','규정':'規定','조사 도구':'調査道具',
      '조사 결과는 항상 정확합니다. 다만 정답을 직접 말하지 않고 특징만 보여줍니다.':'調査結果は常に正確です。ただし答えを直接示さず、特徴のみを表示します。',
      '적재소 연계':'保管所連携','개봉하면 현재 상자 한 개가 보관 목록에서 빠집니다. 남은 상자가 없으면 적재소에서 다시 구매해야 합니다.':'開封すると現在の箱が保管一覧から1個減ります。箱がなくなった場合は保管所で再購入してください。',
      '상자 없음':'箱なし','적재소에서 상자를 구매하세요':'保管所で箱を購入してください','감정할 상자가 없습니다':'鑑定する箱がありません',
      '적재소에서 상자를 구매하면 이곳에서 바로 조사할 수 있습니다.':'保管所で箱を購入すると、ここですぐに調査できます。','적재소로 이동':'保管所へ移動','개봉 중':'開封中','정답 공개':'答えを公開','다음 상자':'次の箱',
      '조사 기록':'調査記録','아직 기록된 조사 결과가 없습니다.':'まだ調査結果は記録されていません。','최종 추리':'最終推理',
      '조사 결과를 바탕으로 카테고리와 안전성을 선택한 뒤 상자를 개봉하세요.':'調査結果をもとにカテゴリーと安全性を選択してから箱を開封してください。',
      '예상 카테고리':'予想カテゴリー','판단 보류':'判断保留','생물':'生物','귀중품':'貴重品','폭발물':'爆発物','잡동사니':'雑貨',
      '예상 안전성':'予想安全性','안전':'安全','주의':'注意','위험':'危険','상자 개봉':'箱を開封','추리 결과 확인':'推理結果を確認',
      '상자를 구매해 감정소에 공급합니다.':'箱を購入して鑑定所へ供給します。','입고 방식별 가격':'入荷方式別価格','빈 적재대':'空の保管台',
      '상자를 구매하면 아래에서부터 차곡차곡 쌓입니다.':'箱を購入すると下から順に積み上がります。','미감정 상자':'未鑑定の箱','입고 방식에 따라 가격과 별 등급 확률이 달라집니다.':'入荷方式によって価格と星等級の確率が変わります。',
      '입고 방식':'入荷方式','일반 입고':'通常入荷','안전 입고':'安全入荷','고급 입고':'高級入荷','압류품 입고':'押収品入荷','미확인 경매':'未確認オークション','상자 1개 구매':'箱を1個購入','보유 상자':'保有箱',
      '아래 목록의 첫 번째 상자부터 감정소로 전달됩니다.':'下の一覧の先頭にある箱から鑑定所へ送られます。','쌓인 상자는 장식이 아니라 실제 재고입니다.':'積まれた箱は飾りではなく実際の在庫です。','감정소에서 처리할 때마다 맨 먼저 들어온 상자부터 한 개씩 줄어듭니다.':'鑑定所で処理するたびに、最初に入庫した箱から1個ずつ減ります。','감정소로 이동':'鑑定所へ移動','보유 상자 비우기':'保有箱をすべて削除',
      '모든 후보 물품을 분류별로 확인합니다.':'すべての候補品を分類別に確認します。','별 등급 1–5':'星等級 1–5','효과음 ON':'効果音 ON','분류':'分類',
      '도감은 업무 시작과 함께 지급됩니다. 조사 결과와 후보 설명을 비교해 카테고리와 안전성을 추리하세요.':'図鑑は業務開始時に支給されます。調査結果と候補の説明を比較し、カテゴリーと安全性を推理してください。',
      '나무 상자':'木箱','은 상자':'銀の箱','금 상자':'金の箱','다이아 상자':'ダイヤの箱','봉인된 상자':'封印された箱','생물 도감':'生物図鑑',
      '상자를 먼저 구매하세요':'先に箱を購入してください','강조된 버튼을 직접 눌러주세요.':'強調されたボタンを押してください。','건너뛰기':'スキップ','다음':'次へ',
      '상자 감정 규정서':'箱鑑定規定書','적재소에서 상자를 사고, 감정소에서 조사한 뒤 정답을 맞히는 순환 업무입니다.':'保管所で箱を購入し、鑑定所で調査して正解を当てる循環業務です。','확인필':'確認済み',
      '무게 측정':'重量測定','내용물의 움직임과 무게 중심':'内容物の動きと重心','표면 온도':'表面温度','카테고리 성질':'カテゴリー特性','투과 검사':'透過検査','내용물 형태 힌트':'内容物の形状ヒント','표면 흔적':'表面痕跡','안전성 힌트':'安全性ヒント','반응 시약':'反応試薬','내용물 성질 힌트':'内容物の性質ヒント','봉인 검사':'封印検査',
      '모든 검사는 정확하지만 표현은 간접적입니다. 한 상자당 4회만 조사할 수 있습니다.':'すべての検査は正確ですが、表現は間接的です。1箱につき4回まで調査できます。',
      '순환 구조':'業務の流れ','1. 적재소에서 입고 방식을 고르고 상자 1개 구매':'1. 保管所で入荷方式を選び、箱を1個購入','2. 감정소에서 최대 4회 조사':'2. 鑑定所で最大4回調査','3. 카테고리와 안전성 선택':'3. カテゴリーと安全性を選択','4. 개봉하면 정답 항목에 따라 보상을 받습니다.':'4. 開封後、正解した項目に応じて報酬を獲得',
      '별 등급별 최대 보상':'星等級別の最大報酬','카테고리와 안전성 보상은 최대 보상의 절반씩 계산됩니다.':'カテゴリーと安全性の報酬は最大報酬の半分ずつです。','둘 다 오답: 0 G':'両方不正解: 0 G','하나만 정답: 해당 항목 보상':'片方のみ正解: 該当項目の報酬','둘 다 정답: 등급별 최대 보상':'両方正解: 等級別最大報酬','확인':'確認','다음 날 시작':'翌日を開始',
      '정확':'正確','내용물의 특징':'内容物の特徴','카테고리 측정':'カテゴリー判定','내용물 힌트':'内容物ヒント','위험도 측정':'安全性判定',
      '내부에서 체온성 열원이 움직입니다.':'内部で体温に近い熱源が動いています。','무게 중심이 계속 이동합니다.':'重心が継続的に移動しています。','생물성 형체가 감지됩니다.':'生体らしい形状が検出されました。','생체 반응이 검출됩니다.':'生体反応が検出されました。',
      '내부 온도는 거의 변하지 않습니다.':'内部温度にほとんど変化はありません。','작고 밀도 높은 물체가 들어 있습니다.':'小さく密度の高い内容物です。','정교하게 가공된 물체가 보입니다.':'精巧に加工された形状が確認できます。','금속, 종이 또는 보존 성분이 검출됩니다.':'金属、紙、または保存処理成分が検出されました。',
      '일부 구역에서 비정상적인 열이 감지됩니다.':'一部で異常な熱が検出されました。','한쪽에 고밀도 물질이 몰려 있습니다.':'高密度の物質が片側に集中しています。','선, 용기, 압축된 물질이 함께 보입니다.':'配線、容器、圧縮物質を含む構造が見えます。','연소성 또는 반응성 물질이 검출됩니다.':'可燃性または反応性物質が検出されました。',
      '특별한 열 변화가 없습니다.':'特別な温度変化はありません。','여러 물체가 불규칙하게 섞여 있습니다.':'重心と形状が不規則です。','용도가 서로 다른 물건들이 겹쳐 있습니다.':'用途を特定しにくい複雑な形状です。','먼지, 녹, 합성수지 성분이 섞여 나옵니다.':'ほこり、さび、合成樹脂系の成分が検出されました。','무게 중심이 불안정하고 형태가 일정하지 않습니다.':'重心が不安定で、形状も均一ではありません。','용도를 특정하기 어려운 복잡한 형태가 보입니다.':'用途を特定しにくい複雑な形状が確認できます。','먼지, 녹 또는 합성수지 계열 성분이 검출됩니다.':'ほこり、さび、または合成樹脂系の成分が検出されました。',
      '깊은 긁힘과 충격 흔적이 여러 개 있습니다.':'深い傷と強い衝撃痕があります。','얕은 긁힘과 마찰 자국이 발견됩니다.':'浅い傷と摩擦痕が見つかりました。','큰 손상 없이 비교적 깨끗합니다.':'大きな損傷はなく比較的きれいです。',
      '고위험 화물용 이중 봉인이 사용됐습니다.':'高危険貨物用の二重封印が使われています。','표준 봉인에 보조 잠금이 추가돼 있습니다.':'標準封印に補助ロックが追加されています。','일반 운송용 봉인이 정상적으로 유지됩니다.':'一般輸送用の封印が正常に保たれています。',
      '완벽한 감정':'完全鑑定','부분 감정 성공':'一部鑑定成功','감정 실패':'鑑定失敗','실제 물품':'実際の品物','설명':'説明','실제 카테고리':'実際のカテゴリー','실제 위험도':'実際の安全性','카테고리 추리':'カテゴリー判定','위험도 추리':'安全性判定','총 보상':'合計報酬','정답':'正解','오답':'不正解',
      '보유한 상자가 없습니다.':'保有している箱はありません。','보관 한도 15개':'保管上限15個','보관 한도에 도달했습니다. 감정소에서 상자를 처리하세요.':'保管上限に達しました。鑑定所で箱を処理してください。','한 더미에 5개씩, 최대 15개까지 보관할 수 있습니다.':'1列5個、最大15個まで保管できます。','적재 중':'個を保管中','미감정 상태':'未鑑定状態',
      '보유 상자를 모두 비울까요?':'保有している箱をすべて削除しますか？','돈과 보유 상자를 처음 상태로 되돌릴까요?':'資金と保有箱を初期状態に戻しますか？',
      '첫 상자를 준비하세요':'最初の箱を用意してください','적재소는 감정할 상자를 사서 보관하는 장소입니다. 상자 가격은 200 G입니다.':'保管所は鑑定する箱を購入して保管する場所です。箱の価格は200 Gです。','강조된 상자 1개 구매 버튼을 직접 눌러주세요.':'強調されている「箱を1個購入」ボタンを押してください。','구매 버튼을 직접 눌러주세요':'購入ボタンを押してください',
      '작업장 사이를 이동하세요':'作業場所を移動してください','상자를 준비했으니 이제 감정소로 옮겨야 합니다. 이후에도 하단 이동 버튼으로 적재소와 감정소를 오갈 수 있습니다.':'箱を用意したので、鑑定所へ移動します。以後も画面下部の移動ボタンで保管所と鑑定所を行き来できます。','강조된 감정소 이동 버튼을 직접 눌러주세요.':'強調されている「鑑定所へ移動」ボタンを押してください。','감정소 이동을 눌러주세요':'鑑定所への移動を押してください',
      '첫 번째 단서를 직접 조사하세요':'最初の手掛かりを調査してください','무게 측정은 내용물의 움직임과 무게 중심을 알려줍니다.':'重量測定では内容物の動きと重心を確認できます。','강조된 무게 측정 버튼을 눌러주세요.':'強調されている重量測定ボタンを押してください。','조사 기록을 확인하세요':'調査記録を確認してください','방금 얻은 단서가 조사 기록에 추가됐습니다. 모든 결과는 정확하지만 표현은 간접적입니다.':'取得した手掛かりが調査記録に追加されました。結果はすべて正確ですが、表現は間接的です。','기록을 읽은 뒤 아래 확인 버튼을 눌러주세요.':'記録を読んだ後、下の確認ボタンを押してください。','확인했어요':'確認しました',
      '안전성 단서를 하나 더 찾으세요':'安全性の手掛かりをもう一つ調べてください','위험도 단서를 하나 더 찾으세요':'安全性の手掛かりをもう一つ調べてください','표면 흔적은 상자 안쪽의 긁힘과 충격 흔적으로 위험도를 알려줍니다.':'表面痕跡では箱内部の傷や衝撃痕から安全性を推測できます。','강조된 표면 흔적 버튼을 눌러주세요.':'強調されている表面痕跡ボタンを押してください。','판정을 직접 입력하세요':'判定を入力してください','카테고리와 위험도를 선택해야 개봉 결과와 비교할 수 있습니다.':'カテゴリーと安全性を選択すると、開封結果と比較できます。','카테고리와 위험도를 모두 선택해주세요.':'カテゴリーと安全性を両方選択してください。',
      '상자를 개봉해 답을 확인하세요':'箱を開封して答えを確認してください','개봉하면 상자 한 개가 소비되고 카테고리와 위험도 정답마다 150 G를 받습니다.':'開封すると箱を1個消費し、カテゴリーと安全性の正解項目ごとに報酬を獲得します。','강조된 상자 개봉 버튼을 눌러주세요.':'強調されている箱開封ボタンを押してください。','정산표를 읽어보세요':'精算表を確認してください','카테고리 정답 150 G와 위험도 정답 150 G가 각각 계산됩니다. 둘 다 맞히면 총 300 G입니다.':'カテゴリーと安全性の報酬がそれぞれ計算されます。星1の箱では両方正解で合計300 Gです。','정산 내역을 확인하면 첫 업무가 끝납니다.':'精算内容を確認すると最初の業務が完了します。','튜토리얼 완료':'チュートリアル完了','직접 조작해주세요':'画面を操作してください',
      '업무 인수서에 서명하세요':'業務引継書に署名してください','쌓여 있는 서류 중 마지막 인수 확인서입니다. 빈칸에 이름을 입력한 뒤 업무 인수 버튼을 눌러주세요.':'積まれた書類の最後にある引継確認書です。署名欄に名前を入力してから業務引継ボタンを押してください。','서명란에 이름을 입력하고 아래 버튼을 눌러주세요.':'署名欄に名前を入力し、下のボタンを押してください。','서명 후 버튼을 눌러주세요':'署名後にボタンを押してください',
      '효과음 OFF':'効果音 OFF','효과음 ON':'効果音 ON','구매 완료':'購入完了','잔액이 부족합니다.':'残高が不足しています。','카테고리와 안전성을 모두 선택하세요.':'カテゴリーと安全性を両方選択してください。'
    };

    const itemJa={
      '슈뢰딩거의 고양이(적응)':['シュレーディンガーの猫（適応）','フルベ・ユラユラ……'],
      '코가 긴 길고양이':['鼻の長い野良猫','たらいが物騒で仕方ありません'],
      '담배피는 고양이':['煙草を吸う猫','呼吸器疾患を引き起こします'],
      '드래곤':['ドラゴン','格好いいです'],'짱룡':['チャンリュウ','通販サイトから届きました'],'북극곰':['ホッキョクグマ','北極が溶けるその日まで'],'마즈':['マーズ','マレーグマです'],'보노보':['ボノボ','逆から読んでもボノボ'],'성인 남성':['成人男性','なぜ入っているのですか'],'개발자':['開発者','本当に売るつもりなのか……'],'아트팀':['アートチーム','助けてください'],'자라나는 금덩이':['育つ金塊','すくすく育ちます'],'슬라임':['スライム','ね……ば……ね……ば……'],'세상에서 가장 귀여운 고양이':['世界で一番かわいい猫','かわいいです'],'슈뢰딩거의 고양이(생존)':['シュレーディンガーの猫（生存）','しかし生きていました'],
      '수상한 책':['怪しい本','怪しいです'],'상속인이 얽힌 집문서':['相続争いの権利書','法廷の沼へ'],'하얀색 가루':['白い粉','気分が良くなります'],'콘솔 게임기':['家庭用ゲーム機','砂漠から掘り出されました'],'낡은 왕관':['古びた王冠','王はいなくても王冠は残りました'],'순금 명함':['純金の名刺','持ち主は不明です'],'검은 진주':['黒真珠','光を飲み込む色です'],'고장 난 회중시계':['壊れた懐中時計','時間よりも価値があります'],'봉인된 우표첩':['封印された切手帳','手紙より長く生き残りました'],'오래된 주식 증서':['古い株券','紙一枚に希望が貼り付いています'],'출처불명 금덩어리':['出所不明の金塊','かつて別の金塊の一部でした'],'금화':['金貨','金で作られた貨幣です'],'가짜처럼 보이는 진짜 다이아몬드':['偽物に見える本物のダイヤ','研究室で作られました'],'비싼 술':['高級酒','いつ飲んでも悪くありません'],'두바이쫀득쿠키':['ドバイもちもちクッキー','もちもちでさくさくです'],
      '알라의 요술봉':['アラーの魔法の杖','赤い砂、黒い金'],'뚱뚱한 청년':['太った青年','影が先に到着します'],'작은 소년':['小さな少年','小さくても決して軽くありません'],'빨간 풍선 99개':['99個の赤い風船','君を思いながら飛ばします'],'거꾸로 가는 시계':['逆回りの時計','時計じゃないよ～'],'빨간 버튼':['赤いボタン','ボードゲームカフェです'],'압력식 광산용 뇌관':['圧力式鉱山用雷管','踏まなくても注意してください'],'다이너마이트':['ダイナマイト','一、二、三、発破！'],'화약 꾸러미':['火薬包み','火気を近づけないでください'],'LPG가스통':['LPGガスボンベ','涼しい場所で保管してください'],'불붙은 폭죽':['火のついた花火','もう遅いかもしれません'],'보조 배터리':['モバイルバッテリー','時々爆発します'],'터질 듯한 풍선':['破裂寸前の風船','針一本で終わりです'],'멘토스와 콜라':['メントスとコーラ','組み合わせが有名すぎます'],'흔들어진 콜라':['振られたコーラ','べたべたして甘いです'],
      '핵폐기물':['核廃棄物','なぜここにあるのですか？'],'끊어진 이어폰':['断線したイヤホン','片耳だけ聞こえた時代も終わりました'],'빈 통조림':['空き缶','中には思い出すらありません'],'젖은 양말':['濡れた靴下','原因は知りたくありません'],'깨진 우산':['壊れた傘','雨ではなく風に負けました'],'낡은 리모컨':['古いリモコン','どの機器のものか分かりません'],'단추 한 통':['ボタンの瓶','相方を失ったものたちです'],'구겨진 영수증':['しわくちゃのレシート','覚えていない消費の記録'],'바퀴 하나 없는 의자':['車輪が一つない椅子','座った瞬間に覚悟します'],'빈 액자':['空の額縁','一番大切なものがありません'],'고장 난 토스터':['壊れたトースター','パンより先に煙が出ます'],'정체불명의 케이블':['正体不明のケーブル','捨てると翌日に必要になります'],'OMR 카드':['OMRカード','それぞれの物語が詰まった数十万の夢'],'연필깎이':['鉛筆削り','先を鋭くします'],'일회용 귀마개':['使い捨て耳栓','いつでもどこでも快適に']
    };

    function localizedItem(item){
      if(currentLanguage!=='ja')return{name:item.name,description:item.description};
      const translated=itemJa[item.name];
      return translated?{name:translated[0],description:translated[1]}:{name:item.name,description:item.description};
    }
    function localizedCategory(key){return currentLanguage==='ja'?({mimic:'生物',treasure:'貴重品',explosive:'爆発物',junk:'雑貨'}[key]||key):(itemCatalog[key]?.label||key)}
    function localizedRisk(key){return currentLanguage==='ja'?({safe:'安全',warning:'注意',danger:'危険'}[key]||key):riskLabel[key]}
    function localizedChest(grade){return currentLanguage==='ja'?['木箱','銀の箱','金の箱','ダイヤの箱','封印された箱'][grade]:chestNames[grade]}
    function translateString(text){
      if(currentLanguage!=='ja'||!text)return text;
      const trimmed=text.trim();
      if(jaText[trimmed])return text.replace(trimmed,jaText[trimmed]);
      let out=text;
      Object.entries(jaText).sort((a,b)=>b[0].length-a[0].length).forEach(([ko,ja])=>{if(out.includes(ko))out=out.split(ko).join(ja)});
      const patterns=[
        [/보유 상자 (\d+) \/ (\d+)개/g,'保有箱 $1 / $2個'],[/보유 상자 (\d+)개/g,'保有箱 $1個'],[/^(\d+)개$/,'$1個'],[/^(\d+)개 적재 중$/,'$1個を保管中'],
        [/발견 (\d+) \/ (\d+)/g,'発見 $1 / $2'],[/(\d+) \/ (\d+) 발견/g,'$1 / $2 発見'],[/연속 (\d+)/g,'連続 $1'],
        [/상자를 열어 (.+)을\(를\) 확인했습니다\./g,'箱を開けて「$1」を確認しました。'],[/^(\d+)\. 미감정 상자$/,'$1. 未鑑定の箱'],
        [/정답 \+(\d+) G/g,'正解 +$1 G'],[/오답 \+0 G/g,'不正解 +0 G'],[/^(\d+)성 상자$/,'星$1の箱'],[/· 미감정 상태/g,'· 未鑑定状態']
      ];
      patterns.forEach(([r,v])=>out=out.replace(r,v));
      return out;
    }
    function translateNode(node){
      if(currentLanguage!=='ja')return;
      if(node.nodeType===Node.TEXT_NODE){const next=translateString(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next;return}
      if(node.nodeType!==Node.ELEMENT_NODE)return;
      node.childNodes.forEach(translateNode);
      ['placeholder','title','aria-label'].forEach(attr=>{if(node.hasAttribute?.(attr))node.setAttribute(attr,translateString(node.getAttribute(attr)))})
    }
    function applyLanguage(){
      document.documentElement.lang=currentLanguage;
      document.title=currentLanguage==='ja'?'箱鑑定所':'상자 감정소';
      if(currentLanguage==='ja')translateNode(document.body);
      startLanguageObserver();updateSoundButtons();
      createTools();updateGlobalUI();updateStorageUI(false);updateInspectionUI();renderCollection?.();
    }
    function chooseLanguage(lang){
      currentLanguage=lang==='ja'?'ja':'ko';
      try{localStorage.setItem(LANGUAGE_KEY,currentLanguage)}catch(error){}
      $('#languageSelect')?.classList.add('hidden');
      applyLanguage();
    }


    // 일본어 선택 후 동적으로 만들어지는 문구도 즉시 번역합니다.
    let languageObserver=null;
    function startLanguageObserver(){
      languageObserver?.disconnect();
      if(currentLanguage!=='ja')return;
      languageObserver=new MutationObserver(records=>{
        languageObserver.disconnect();
        records.forEach(record=>{
          record.addedNodes.forEach(node=>translateNode(node));
          if(record.type==='characterData')translateNode(record.target);
        });
        languageObserver.observe(document.body,{subtree:true,childList:true,characterData:true});
      });
      languageObserver.observe(document.body,{subtree:true,childList:true,characterData:true});
    }

    // 외부 음원 없이 동작하는 짧은 UI 효과음
    const SOUND_KEY='box_appraisal_sound';
    let soundEnabled=(()=>{try{return localStorage.getItem(SOUND_KEY)!=='off'}catch(error){return true}})();
    let audioContext=null;
    function getAudioContext(){
      if(!soundEnabled)return null;
      const Context=window.AudioContext||window.webkitAudioContext;
      if(!Context)return null;
      audioContext ||= new Context();
      if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
      return audioContext;
    }
    function tone(frequency=440,duration=.06,type='sine',volume=.035,delay=0){
      const ctx=getAudioContext();if(!ctx)return;
      const osc=ctx.createOscillator(),gain=ctx.createGain(),now=ctx.currentTime+delay;
      osc.type=type;osc.frequency.setValueAtTime(frequency,now);
      gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),now+.008);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
      osc.connect(gain);gain.connect(ctx.destination);osc.start(now);osc.stop(now+duration+.02);
    }
    function playSound(kind='click'){
      if(!soundEnabled)return;
      if(kind==='buy'){tone(240,.07,'square',.025);tone(360,.09,'sine',.03,.055)}
      else if(kind==='inspect'){tone(520,.05,'triangle',.024);tone(680,.06,'triangle',.02,.045)}
      else if(kind==='open'){tone(150,.09,'sawtooth',.025);tone(95,.13,'sine',.035,.07)}
      else if(kind==='success'){tone(440,.08,'sine',.035);tone(660,.11,'sine',.04,.08)}
      else if(kind==='fail'){tone(220,.1,'square',.025);tone(165,.14,'sine',.03,.08)}
      else tone(410,.045,'sine',.018);
    }
    function updateSoundButtons(){
      document.querySelectorAll('.sound-toggle').forEach(button=>button.textContent=currentLanguage==='ja'?(soundEnabled?'効果音 ON':'効果音 OFF'):(soundEnabled?'효과음 ON':'효과음 OFF'));
    }
    function toggleSound(){soundEnabled=!soundEnabled;try{localStorage.setItem(SOUND_KEY,soundEnabled?'on':'off')}catch(error){};updateSoundButtons();if(soundEnabled)playSound('success')}



    let state=loadState();
    let accidents=0;
    let current=null,used=0,results=[],resolved=false,insMode='idle',insTime=0;

    function loadState(){
      try{
        const raw=JSON.parse(localStorage.getItem(STORE_KEY));
        if(raw&&Number.isFinite(raw.money)&&Array.isArray(raw.boxes))return{...raw,tutorialDone:Boolean(raw.tutorialDone),collection:raw.collection&&typeof raw.collection==='object'?raw.collection:{}};
      }catch(error){console.warn(error)}
      return{money:1000,boxes:[],tutorialDone:false,collection:{}};
    }
    function saveState(){localStorage.setItem(STORE_KEY,JSON.stringify(state));updateGlobalUI()}
    const money=v=>`${Math.round(v).toLocaleString(currentLanguage==='ja'?'ja-JP':'ko-KR')} G`;
    const rand=(a,b)=>Math.random()*(b-a)+a;
    const rint=(a,b)=>Math.floor(rand(a,b+1));
    const pick=a=>a[Math.floor(Math.random()*a.length)];
    function weighted(entries){let total=entries.reduce((s,e)=>s+e.weight,0),roll=Math.random()*total;for(const e of entries){roll-=e.weight;if(roll<=0)return e.value}return entries.at(-1).value}

    function createBoxData(){
      const content=pick(Object.keys(itemCatalog));
      const items=itemCatalog[content].items;
      const itemIndex=rint(0,items.length-1);
      const grade=weighted([{value:0,weight:42},{value:1,weight:28},{value:2,weight:17},{value:3,weight:9},{value:4,weight:4}]);
      return{id:`BX-${Date.now()}-${rint(100,999)}`,grade,itemIndex,content,risk:items[itemIndex].risk,stability:rint(20,95)};
    }

    function mat(color,metalness=0,roughness=.6,em=0,ei=0){return new THREE.MeshStandardMaterial({color,metalness,roughness,emissive:em,emissiveIntensity:ei})}
    function box(w,h,d,m,x=0,y=0,z=0){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;return o}
    function clear(group){while(group.children.length){const c=group.children[0];group.remove(c);c.traverse(o=>{o.geometry?.dispose();if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose())})}}
    function buildChest(group,grade){
      clear(group);const p=palettes[grade],body=mat(p.body,p.m,p.r),panel=mat(p.panel,p.m,p.r),trim=mat(p.trim,Math.min(1,p.m+.22),Math.max(.14,p.r-.2)),accent=mat(p.accent,Math.min(1,p.m+.18),Math.max(.18,p.r-.16));
      group.add(box(3.05,1.34,2.02,body,0,-.25,0),box(3.08,.6,2.05,panel,0,.75,0),box(3.18,.13,2.15,trim,0,-.9,0),box(3.18,.13,2.15,trim,0,.4,0),box(3.18,.13,2.15,trim,0,1.02,0));
      [-1.18,1.18].forEach(x=>group.add(box(.14,2.05,2.13,trim,x,.03,0)));
      group.add(box(grade===4?.72:.55,grade===4?.88:.66,.13,accent,0,.18,1.08));
      const kh=mat(0x181817,.16,.58),circle=new THREE.Mesh(new THREE.CircleGeometry(.055,18),kh);circle.position.set(0,.23,1.151);group.add(circle,box(.052,.13,.025,kh,0,.14,1.153));
    }
    function makeScene(canvas){
      const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100),renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
      camera.position.set(0,2.6,8);camera.lookAt(0,.15,0);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.04;
      scene.add(new THREE.HemisphereLight(0xffffff,0x77736d,2.2));const dl=new THREE.DirectionalLight(0xffffff,4.3);dl.position.set(4,7,5);dl.castShadow=true;scene.add(dl);
      scene.add(box(7.5,.35,5,mat(0xb1a794,.02,.88),0,-1.25,0));scene.add(box(4.8,.04,3.35,mat(0x4b4a45,0,.95),0,-1.05,0));
      return{scene,camera,renderer};
    }

    const inspectionPack=makeScene($('#inspectionCanvas'));
    const inspectionRoot=new THREE.Group(),inspectionModel=new THREE.Group();inspectionRoot.add(inspectionModel);inspectionRoot.position.y=.02;inspectionRoot.rotation.y=-.16;inspectionPack.scene.add(inspectionRoot);
    const storagePack=makeScene($('#storageCanvas'));
    const storageRoot=new THREE.Group();storageRoot.rotation.y=-.12;storagePack.scene.add(storageRoot);
    const storageDropLight=new THREE.PointLight(0xffd996,0,5,2);storageDropLight.position.set(0,4,2);storagePack.scene.add(storageDropLight);

    const tools=[
      {id:'weight',icon:'㎏',name:'무게 측정',info:'내용물의 특징'},
      {id:'temperature',icon:'℃',name:'표면 온도',info:'카테고리 측정'},
      {id:'scan',icon:'▧',name:'투과 검사',info:'내용물 힌트'},
      {id:'surface',icon:'⌕',name:'표면 흔적',info:'위험도 측정'},
      {id:'reagent',icon:'●',name:'반응 시약',info:'내용물 힌트'},
      {id:'seal',icon:'封',name:'봉인 검사',info:'위험도 측정'}
    ];
    function truthful(id){
      const category=itemCatalog[current.content]||itemCatalog.mimic;
      const item=category.items[current.itemIndex]||category.items[0];
      const localized=localizedItem(item);
      const categoryClues={
        mimic:{temperature:['내부에서 체온성 열원이 움직입니다.'],weight:['무게 중심이 계속 이동합니다.'],scan:['생물성 형체가 감지됩니다.'],reagent:['생체 반응이 검출됩니다.']},
        treasure:{temperature:['내부 온도는 거의 변하지 않습니다.'],weight:['작고 밀도 높은 물체가 들어 있습니다.'],scan:['정교하게 가공된 물체가 보입니다.'],reagent:['금속, 종이 또는 보존 성분이 검출됩니다.']},
        explosive:{temperature:['일부 구역에서 비정상적인 열이 감지됩니다.'],weight:['한쪽에 고밀도 물질이 몰려 있습니다.'],scan:['선, 용기, 압축된 물질이 함께 보입니다.'],reagent:['연소성 또는 반응성 물질이 검출됩니다.']},
        junk:{temperature:['특별한 열 변화가 없습니다.'],weight:['무게 중심이 불안정하고 형태가 일정하지 않습니다.'],scan:['용도를 특정하기 어려운 복잡한 형태가 보입니다.'],reagent:['먼지, 녹 또는 합성수지 계열 성분이 검출됩니다.']}
      };
      if(id==='temperature')return pick(categoryClues[current.content].temperature);
      if(id==='weight')return pick(categoryClues[current.content].weight);
      if(id==='scan')return pick(categoryClues[current.content].scan);
      if(id==='reagent')return pick(categoryClues[current.content].reagent);
      if(id==='surface')return pick({danger:['깊은 긁힘과 충격 흔적이 여러 개 있습니다.'],warning:['얕은 긁힘과 마찰 자국이 발견됩니다.'],safe:['큰 손상 없이 비교적 깨끗합니다.']}[current.risk]);
      if(id==='seal')return pick({danger:['고위험 화물용 이중 봉인이 사용됐습니다.'],warning:['표준 봉인에 보조 잠금이 추가돼 있습니다.'],safe:['일반 운송용 봉인이 정상적으로 유지됩니다.']}[current.risk]);
      return currentLanguage==='ja'?`${localized.name}に関連する間接反応が検出されました。`:`${item.name}과 관련된 간접 반응이 감지됩니다.`;
    }

    function createTools(){
      const list=$('#toolList');list.innerHTML='';
      tools.forEach(t=>{const b=document.createElement('button');b.className='tool-button';b.dataset.tool=t.id;b.innerHTML=`<span class="tool-icon">${t.icon}</span><span><span class="tool-name">${translateString(t.name)}</span><span class="tool-info">${translateString(t.info)}</span></span><span class="tool-accuracy">${translateString('정확')}</span>`;b.onclick=()=>inspect(t);list.appendChild(b)});
    }
    function inspect(tool){if(!current||resolved||used>=4)return;playSound('inspect');used++;results.push({id:tool.id,name:translateString(tool.name),text:translateString(truthful(tool.id))});insMode=tool.id==='weight'?'lift':'inspect';insTime=0;updateInspectionUI();advanceInspectionGuide('tool',tool.id)}

    function beginCurrentBox(){
      current=state.boxes.length?state.boxes[0]:null;if(current&&!itemCatalog[current.content])current.content='mimic';used=0;results=[];resolved=false;$('#contentGuess').value='unknown';$('#riskGuess').value='unknown';$('#resultLayer').classList.remove('show');
      if(current){buildChest(inspectionModel,current.grade);inspectionRoot.visible=true;$('#inspectionEmpty').classList.add('hidden')}else{clear(inspectionModel);inspectionRoot.visible=false;$('#inspectionEmpty').classList.remove('hidden')}
      updateInspectionUI();
    }
    function updateInspectionUI(){
      $('#inspectionMoney').textContent=money(state.money);$('#inspectionInventoryText').textContent=`보유 상자 ${state.boxes.length} / ${MAX_BOXES}개`;$('#inspectionBoxCount').textContent=`${state.boxes.length} / ${MAX_BOXES}`;$('#inventoryProgress').style.width=`${state.boxes.length/MAX_BOXES*100}%`;
      if(current){$('#caseNumber').textContent='STORED BOX';$('#caseName').textContent=localizedChest(current.grade);$('#caseSub').textContent=`${current.id.split('-').slice(0,2).join('-')} · ${currentLanguage==='ja'?'未鑑定状態':'미감정 상태'}`}else{$('#caseName').textContent='상자 없음';$('#caseSub').textContent='적재소에서 상자를 구매하세요'}
      $$('#inspectionCount .inspection-dot').forEach((d,i)=>d.className=`inspection-dot ${i<used?'used':'available'}`);
      $('#clueList').innerHTML=results.length?results.map((r,i)=>`<article class="clue-item"><div class="clue-head"><span class="clue-name">${i+1}. ${r.name}</span><span class="clue-confidence">정확</span></div><p class="clue-result">${r.text}</p></article>`).join(''):'<div class="clue-empty">아직 기록된 조사 결과가 없습니다.</div>';
      $$('#toolList .tool-button').forEach(b=>b.disabled=!current||resolved||used>=4||results.some(r=>r.id===b.dataset.tool));
      $$('#inspectionGame .action-button').forEach(b=>b.disabled=!current||resolved);$('#contentGuess').disabled=$('#riskGuess').disabled=!current||resolved;
    }
    function resolveAction(action){
      if(!current||resolved||action!=="open")return;
      playSound('open');
      resolved=true;
      const category=itemCatalog[current.content]||itemCatalog.mimic;
      const item=category.items[current.itemIndex]||category.items[0];
      const localized=localizedItem(item);
      const categoryCorrect=$('#contentGuess').value===current.content;
      const riskCorrect=$('#riskGuess').value===current.risk;
      const categoryReward=categoryCorrect?CATEGORY_REWARD:0;
      const riskReward=riskCorrect?RISK_REWARD:0;
      const reward=categoryReward+riskReward;

      state.money+=reward;
      state.collection=state.collection||{};
      const collectionKey=`${current.content}:${current.itemIndex}`;
      const previous=state.collection[collectionKey]||{count:0,maxGrade:-1};
      state.collection[collectionKey]={count:previous.count+1,maxGrade:Math.max(previous.maxGrade,current.grade)};
      state.boxes.shift();
      saveState();

      $('#resultKicker').textContent='ANSWER CHECK';
      $('#resultTitle').textContent=categoryCorrect&&riskCorrect?'완벽한 감정':categoryCorrect||riskCorrect?'부분 감정 성공':'감정 실패';playSound(categoryCorrect||riskCorrect?'success':'fail');
      $('#resultDescription').textContent=currentLanguage==='ja'?`箱を開けて「${localized.name}」を確認しました。`:`상자를 열어 ${item.name}을(를) 확인했습니다.`;
      $('#resultMoney').textContent=`+${money(reward)}`;
      $('#resultMoney').style.color=reward>0?'var(--green)':'var(--sub)';
      $('#resultDetails').innerHTML=currentLanguage==='ja'?`<div class="result-detail-row"><span>実際の品物</span><strong>${localized.name}</strong></div><div class="result-detail-row"><span>説明</span><strong>${localized.description}</strong></div><div class="result-detail-row"><span>実際のカテゴリー</span><strong>${localizedCategory(current.content)}</strong></div><div class="result-detail-row"><span>実際の安全性</span><strong>${localizedRisk(current.risk)}</strong></div><div class="result-detail-row"><span>カテゴリー判定</span><strong>${categoryCorrect?`正解 +${CATEGORY_REWARD} G`:'不正解 +0 G'}</strong></div><div class="result-detail-row"><span>安全性判定</span><strong>${riskCorrect?`正解 +${RISK_REWARD} G`:'不正解 +0 G'}</strong></div><div class="result-detail-row"><span>合計報酬</span><strong>+${reward} G</strong></div>`:`<div class="result-detail-row"><span>실제 물품</span><strong>${item.name}</strong></div><div class="result-detail-row"><span>설명</span><strong>${item.description}</strong></div><div class="result-detail-row"><span>실제 카테고리</span><strong>${category.label}</strong></div><div class="result-detail-row"><span>실제 위험도</span><strong>${riskLabel[current.risk]}</strong></div><div class="result-detail-row"><span>카테고리 추리</span><strong>${categoryCorrect?`정답 +${CATEGORY_REWARD} G`:'오답 +0 G'}</strong></div><div class="result-detail-row"><span>위험도 추리</span><strong>${riskCorrect?`정답 +${RISK_REWARD} G`:'오답 +0 G'}</strong></div><div class="result-detail-row"><span>총 보상</span><strong>+${reward} G</strong></div>`;
      $('#resultNext').textContent=state.boxes.length?'다음 보유 상자':'적재소로 이동';
      $('#resultLayer').classList.add('show');
      advanceInspectionGuide('open');
      updateInspectionUI();
      updateStorageUI();
    }

    let storageDropAnimation=null;
    let storageAnimating=false;
    let onboardingActive=false;
    let onboardingPurchased=false;

    function storagePlacement(index){
      const scale=.29;
      const chestMinY=-.965;
      const chestHeight=2.03;
      const platformTop=-1.03;
      const firstY=platformTop-chestMinY*scale+.018;
      const step=chestHeight*scale+.05;
      const columnX=[-1.12,0,1.12];
      const column=Math.floor(index/5);
      const row=index%5;
      return{
        scale,
        column,
        row,
        x:columnX[column],
        y:firstY+row*step,
        z:0,
        rotationY:(column-1)*.025
      };
    }

    function buildStorageStack(animatedIndex=-1){
      clear(storageRoot);
      storageDropAnimation=null;
      const visible=state.boxes.slice(0,MAX_BOXES);
      if(!visible.length)return;

      visible.forEach((data,index)=>{
        const place=storagePlacement(index);
        const g=new THREE.Group();
        buildChest(g,data.grade);
        g.scale.setScalar(place.scale);
        g.position.set(place.x,place.y,place.z);
        g.rotation.y=place.rotationY;
        g.userData.stackColumn=place.column;
        g.userData.stackRow=place.row;
        storageRoot.add(g);

        if(index===animatedIndex){
          g.position.set(place.x,place.y+3.65,place.z);
          g.rotation.set(.03,place.rotationY+.025,.02);
          g.scale.setScalar(place.scale*.94);
          const ghosts=[];
          for(let ghostIndex=0;ghostIndex<1;ghostIndex++){
            const ghost=new THREE.Group();buildChest(ghost,data.grade);ghost.scale.setScalar(place.scale*(.94-ghostIndex*.025));ghost.position.set(place.x,place.y+3.65+(ghostIndex+1)*.28,place.z);ghost.rotation.copy(g.rotation);ghost.traverse(object=>{if(object.material){const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(material=>{material.transparent=true;material.opacity=.055;material.depthWrite=false})}});storageRoot.add(ghost);ghosts.push(ghost);
          }
          storageDropAnimation={mesh:g,ghosts,time:0,duration:.92,startY:g.position.y,targetX:place.x,targetY:place.y,targetZ:place.z,targetScale:place.scale,targetRotationY:place.rotationY,column:place.column};
        }
      });
    }

    function finishStorageDrop(){
      if(storageDropAnimation?.ghosts)storageDropAnimation.ghosts.forEach(ghost=>{storageRoot.remove(ghost);ghost.traverse(o=>{o.geometry?.dispose();if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose())})});
      storageDropAnimation=null;
      storageDropLight.intensity=0;
      storageAnimating=false;
      storageRoot.position.x=0;
      storageRoot.rotation.z=0;
      updateStorageUI(false);
      if(onboardingActive&&onboardingPurchased){onboardingPurchased=false;setTimeout(startMoveGuide,360)}
    }

    function buyBox(){playSound('buy');
      if(storageAnimating||state.money<BOX_PRICE||state.boxes.length>=MAX_BOXES)return;
      const newIndex=state.boxes.length;
      storageAnimating=true;
      state.money-=BOX_PRICE;
      state.boxes.push(createBoxData());
      if(onboardingActive){onboardingPurchased=true;guideOverlay.classList.add('hidden')};
      saveState();
      updateStorageUI(false);
      buildStorageStack(newIndex);
    }
    function updateStorageUI(rebuild=true){
      $('#storageMoney').textContent=money(state.money);$('#storageCount').textContent=state.boxes.length;$('#storageProgressText').textContent=`보유 상자 ${state.boxes.length} / ${MAX_BOXES}개`;$('#storageProgress').style.width=`${state.boxes.length/MAX_BOXES*100}%`;$('#storageLabelTitle').textContent=state.boxes.length?`${state.boxes.length}개 적재 중`:'빈 적재대';$('#storageLabelSub').textContent=state.boxes.length>=MAX_BOXES?'보관 한도에 도달했습니다. 감정소에서 상자를 처리하세요.':'한 더미에 5개씩, 최대 15개까지 보관할 수 있습니다.';
      const purchaseLocked=storageAnimating||state.money<BOX_PRICE||state.boxes.length>=MAX_BOXES;
      $('#buyBoxButton').disabled=$('#buyAnotherButton').disabled=purchaseLocked;
      $('#buyBoxButton').textContent=$('#buyAnotherButton').textContent=state.boxes.length>=MAX_BOXES?'보관 한도 15개':'상자 1개 구매';
      $('#goInspectionButton').disabled=state.boxes.length===0;
      const list=$('#storageList');list.innerHTML=state.boxes.length?state.boxes.map((b,i)=>`<div class="storage-row"><span>${i+1}. 미감정 상자</span><span>${localizedChest(b.grade)}</span></div>`).join(''):'<div class="storage-empty">보유한 상자가 없습니다.</div>';
      if(rebuild)buildStorageStack();
    }
    function updateGlobalUI(){$('#menuMoney').textContent=money(state.money);$('#menuBoxes').textContent=`${state.boxes.length}개`;$('#inspectionMoney').textContent=money(state.money);$('#inspectionBoxCount').textContent=`${state.boxes.length} / ${MAX_BOXES}`;$('#storageMoney').textContent=money(state.money)}

    const mainMenu=$('#mainMenu'),inspectionGame=$('#inspectionGame'),storageGame=$('#storageGame'),collectionGame=$('#collectionGame');
    function showScreen(screen){[mainMenu,inspectionGame,storageGame,collectionGame].forEach(x=>x.classList.add('hidden'));screen.classList.remove('hidden');updateGlobalUI()}
    function updateMainFirstRun(){mainMenu.classList.toggle('first-run',!state.tutorialDone)}
    function goMain(){showScreen(mainMenu);updateMainFirstRun();updateGlobalUI()}
    function goInspection(){showScreen(inspectionGame);beginCurrentBox();resizeInspection()}
    function goStorage(){showScreen(storageGame);updateStorageUI();resizeStorage()}


    let collectionCategory='mimic';
    let collectionReturnScreen=mainMenu;
    function openCollection(fromScreen=mainMenu){
      collectionReturnScreen=fromScreen||mainMenu;
      showScreen(collectionGame);
      renderCollection();
    }
    function renderCollection(){
      if(!$('#collectionGrid'))return;
      state.collection=state.collection||{};
      const categories=['mimic','treasure','explosive','junk'];
      const total=categories.reduce((sum,key)=>sum+itemCatalog[key].items.length,0);
      const discovered=Object.keys(state.collection).filter(key=>state.collection[key]?.count>0).length;
      $('#collectionProgressText').textContent=currentLanguage==='ja'?`発見 ${discovered} / ${total}`:`발견 ${discovered} / ${total}`;
      $('#collectionCount').textContent=`${discovered} / ${total}`;
      $('#collectionProgress').style.width=`${discovered/total*100}%`;
      const tabs=$('#collectionTabs');
      tabs.innerHTML=categories.map(key=>`<button type="button" class="collection-tab ${collectionCategory===key?'active':''}" data-category="${key}">${localizedCategory(key)}</button>`).join('');
      tabs.querySelectorAll('button').forEach(button=>button.onclick=()=>{collectionCategory=button.dataset.category;renderCollection()});
      const category=itemCatalog[collectionCategory];
      const foundInCategory=category.items.reduce((sum,_,index)=>sum+(state.collection[`${collectionCategory}:${index}`]?.count>0?1:0),0);
      $('#collectionCategoryLabel').textContent=collectionCategory.toUpperCase();
      $('#collectionCategoryTitle').textContent=currentLanguage==='ja'?`${localizedCategory(collectionCategory)}図鑑`:`${category.label} 도감`;
      $('#collectionCategoryCount').textContent=currentLanguage==='ja'?`${foundInCategory} / ${category.items.length} 発見`:`${foundInCategory} / ${category.items.length} 발견`;
      $('#collectionGrid').innerHTML=category.items.map((item,index)=>{
        const record=state.collection[`${collectionCategory}:${index}`];
        const localized=localizedItem(item);
        const discoveredItem=Boolean(record?.count);
        const stars=record?`${'★'.repeat(record.maxGrade+1)}${'☆'.repeat(4-record.maxGrade)}`:'☆☆☆☆☆';
        return `<article class="collection-card ${discoveredItem?'discovered':'undiscovered'}"><div class="collection-card-top"><span>${String(index+1).padStart(2,'0')}</span><span>${stars}</span></div><h3>${localized.name}</h3><p>${localized.description}</p><div class="collection-card-meta"><span>${localizedRisk(item.risk)}</span><span>${currentLanguage==='ja'?`発見 ${record?.count||0}回`:`발견 ${record?.count||0}회`}</span></div></article>`;
      }).join('');
      if(currentLanguage==='ja')translateNode(collectionGame);
    }

    const translationObserver=new MutationObserver(mutations=>{
      if(currentLanguage!=='ja')return;
      for(const mutation of mutations){
        mutation.addedNodes.forEach(translateNode);
        if(mutation.type==='characterData')translateNode(mutation.target);
      }
    });
    translationObserver.observe(document.body,{subtree:true,childList:true,characterData:true});


    const workerSignature=$('#workerSignature'),signaturePadWrap=$('#signaturePadWrap');
    const signatureContext=workerSignature.getContext('2d');
    let signatureDrawing=false,signatureLength=0,signatureLast=null,signatureAccepted=false,signatureMoveTimer=null;
    function resizeSignaturePad(){
      const rect=signaturePadWrap.getBoundingClientRect();if(!rect.width||!rect.height)return;
      const ratio=Math.min(devicePixelRatio||1,2),snapshot=document.createElement('canvas');
      snapshot.width=workerSignature.width;snapshot.height=workerSignature.height;snapshot.getContext('2d').drawImage(workerSignature,0,0);
      workerSignature.width=Math.round(rect.width*ratio);workerSignature.height=Math.round(rect.height*ratio);
      signatureContext.setTransform(ratio,0,0,ratio,0,0);signatureContext.lineCap='round';signatureContext.lineJoin='round';signatureContext.strokeStyle='#22201d';signatureContext.lineWidth=2.4;
      if(snapshot.width&&snapshot.height)signatureContext.drawImage(snapshot,0,0,snapshot.width,snapshot.height,0,0,rect.width,rect.height);
    }
    function signaturePoint(event){const rect=workerSignature.getBoundingClientRect();return{x:event.clientX-rect.left,y:event.clientY-rect.top}}
    function finishSignature(){
      signatureDrawing=false;signatureLast=null;
      if(signatureLength<42||signatureAccepted)return;
      signatureAccepted=true;signaturePadWrap.classList.add('ready');
      clearTimeout(signatureMoveTimer);signatureMoveTimer=setTimeout(()=>{onboardingActive=true;goStorage();setTimeout(startStorageGuide,220)},700);
    }
    workerSignature.addEventListener('pointerdown',event=>{
      if(signatureAccepted)return;signatureDrawing=true;signatureLast=signaturePoint(event);workerSignature.setPointerCapture(event.pointerId);signaturePadWrap.classList.add('signed');
      signatureContext.beginPath();signatureContext.moveTo(signatureLast.x,signatureLast.y);event.preventDefault();
    });
    workerSignature.addEventListener('pointermove',event=>{
      if(!signatureDrawing||signatureAccepted)return;const point=signaturePoint(event),dx=point.x-signatureLast.x,dy=point.y-signatureLast.y;
      signatureLength+=Math.hypot(dx,dy);signatureContext.lineTo(point.x,point.y);signatureContext.stroke();signatureLast=point;event.preventDefault();
    });
    workerSignature.addEventListener('pointerup',finishSignature);workerSignature.addEventListener('pointercancel',finishSignature);workerSignature.addEventListener('pointerleave',event=>{if(signatureDrawing&&event.buttons===0)finishSignature()});
    $('#startLoopButton').onclick=()=>goStorage();$('#modeInspectionButton').onclick=goInspection;$('#modeStorageButton').onclick=goStorage;$('#inspectionHome').onclick=goMain;$('#storageHome').onclick=goMain;$('#goStorageButton').onclick=goStorage;$('#emptyGoStorage').onclick=goStorage;$('#goInspectionButton').onclick=()=>{goInspection();if(onboardingActive&&guideMode==='move')setTimeout(startInspectionGuide,180)};
    $('#modeCollectionButton').onclick=()=>openCollection(mainMenu);$('#inspectionCollection').onclick=()=>openCollection(inspectionGame);$('#collectionHome').onclick=()=>{showScreen(collectionReturnScreen);if(collectionReturnScreen===inspectionGame){updateInspectionUI();resizeInspection()}else if(collectionReturnScreen===storageGame){updateStorageUI();resizeStorage()}};
    $('#selectKorean').onclick=()=>chooseLanguage('ko');$('#selectJapanese').onclick=()=>chooseLanguage('ja');
    $('#buyBoxButton').onclick=buyBox;$('#buyAnotherButton').onclick=buyBox;
    $('#clearBoxesButton').onclick=()=>{if(confirm(translateString('보유 상자를 모두 비울까요?'))){state.boxes=[];saveState();updateStorageUI()}};
    const resetAllData=()=>{const message=currentLanguage==='ja'?'資金、保有箱、図鑑を初期状態に戻しますか？':'돈, 보유 상자, 도감 기록을 처음 상태로 되돌릴까요?';if(confirm(message)){state={money:1000,boxes:[],tutorialDone:false,collection:{}};saveState();beginCurrentBox();updateStorageUI();renderCollection();goMain()}};$('#resetSaveButton').onclick=resetAllData;
    document.querySelectorAll('.sound-toggle').forEach(button=>button.onclick=toggleSound);
    document.addEventListener('pointerdown',event=>{const button=event.target.closest('button');if(button&&!button.classList.contains('sound-toggle'))playSound('click')},{passive:true});
    $('#ruleButton').onclick=()=>$('#ruleOverlay').classList.remove('hidden');$('#ruleClose').onclick=()=>$('#ruleOverlay').classList.add('hidden');
    $('#resultNext').onclick=()=>{if(state.boxes.length)beginCurrentBox();else goStorage()};
    $$('#inspectionGame .action-button').forEach(b=>b.onclick=()=>resolveAction(b.dataset.action));
    $('#contentGuess').addEventListener('change',()=>{if($('#contentGuess').value!=='unknown'&&$('#riskGuess').value!=='unknown')advanceInspectionGuide('guess')});$('#riskGuess').addEventListener('change',()=>{if($('#contentGuess').value!=='unknown'&&$('#riskGuess').value!=='unknown')advanceInspectionGuide('guess')});

    const guideOverlay=$('#guideOverlay'),guideFocus=$('#guideFocus'),guideCard=$('#guideCard'),guideKicker=$('#guideKicker'),guideTitle=$('#guideTitle'),guideText=$('#guideText'),guideTask=$('#guideTask'),guideProgress=$('#guideProgress'),guideNext=$('#guideNext'),guideSkip=$('#guideSkip');
    let guideMode='',guideIndex=0;
    const tutorialText={
      ko:{
        main:{next:'서명 후 버튼을 눌러주세요',title:'업무 인수서에 서명하세요',text:'쌓여 있는 서류 중 마지막 인수 확인서입니다. 서명란에 서명하면 업무를 시작합니다.',task:'서명란에 직접 서명해주세요.'},
        storage:{next:'구매 버튼을 직접 눌러주세요',title:'첫 상자를 준비하세요',text:'적재소는 감정할 상자를 구매해 보관하는 장소입니다. 일반 입고 가격은 200 G입니다.',task:'강조된 상자 구매 버튼을 눌러주세요.'},
        move:{next:'감정소 이동을 눌러주세요',title:'작업장 사이를 이동하세요',text:'상자를 준비했으니 감정소로 옮겨야 합니다. 이후에도 하단 이동 버튼으로 두 작업장을 오갈 수 있습니다.',task:'강조된 감정소 이동 버튼을 눌러주세요.'},
        buttons:{next:'확인했어요',complete:'튜토리얼 완료',action:'직접 조작해주세요'},
        steps:[
          {target:'[data-tool="weight"]',title:'첫 번째 단서를 조사하세요',text:'무게 측정은 내용물의 움직임과 무게 중심을 알려줍니다.',task:'강조된 무게 측정 버튼을 눌러주세요.',action:'tool',value:'weight'},
          {target:'#guideCluesTarget',title:'조사 기록을 확인하세요',text:'방금 얻은 단서가 조사 기록에 추가됐습니다. 모든 결과는 정확하지만 표현은 간접적입니다.',task:'기록을 읽은 뒤 확인 버튼을 눌러주세요.',action:'next'},
          {target:'[data-tool="surface"]',title:'안전성 단서를 더 찾으세요',text:'표면 흔적은 내부의 긁힘과 충격 흔적으로 안전성을 추리하는 데 도움을 줍니다.',task:'강조된 표면 흔적 버튼을 눌러주세요.',action:'tool',value:'surface'},
          {target:'#guideGuessTarget',title:'판정을 입력하세요',text:'카테고리와 안전성을 선택해야 실제 내용물과 판정을 비교할 수 있습니다.',task:'카테고리와 안전성을 모두 선택해주세요.',action:'guess'},
          {target:'#guideOpenTarget',title:'상자를 개봉하세요',text:'개봉하면 상자가 하나 소비되며, 카테고리와 안전성 중 맞힌 항목에 따라 보상을 받습니다.',task:'강조된 상자 개봉 버튼을 눌러주세요.',action:'open'},
          {target:'#resultLayer .result-card',title:'정산표를 확인하세요',text:'카테고리와 안전성 보상은 별 등급별 최대 보상의 절반씩 계산됩니다.',task:'정산 내역을 확인하면 첫 업무가 끝납니다.',action:'complete'}
        ]
      },
      ja:{
        main:{next:'署名してください',title:'業務引継書に署名してください',text:'積まれた書類の中にある最後の業務引継確認書です。署名欄に署名すると業務を開始します。',task:'署名欄に直接署名してください。'},
        storage:{next:'購入ボタンを押してください',title:'最初の箱を準備してください',text:'保管所は鑑定する箱を購入して保管する場所です。通常入荷の価格は200 Gです。',task:'強調されている箱購入ボタンを押してください。'},
        move:{next:'鑑定所へ移動してください',title:'作業場所を移動してください',text:'箱を準備したので鑑定所へ運びます。以後も画面下部の移動ボタンで二つの作業場所を行き来できます。',task:'強調されている鑑定所への移動ボタンを押してください。'},
        buttons:{next:'確認しました',complete:'チュートリアル完了',action:'画面を操作してください'},
        steps:[
          {target:'[data-tool="weight"]',title:'最初の手掛かりを調査してください',text:'重量測定では内容物の動きと重心を確認できます。',task:'強調されている重量測定ボタンを押してください。',action:'tool',value:'weight'},
          {target:'#guideCluesTarget',title:'調査記録を確認してください',text:'得られた手掛かりが調査記録に追加されました。結果は常に正確ですが、表現は間接的です。',task:'記録を読んでから確認ボタンを押してください。',action:'next'},
          {target:'[data-tool="surface"]',title:'安全性の手掛かりを探してください',text:'表面痕跡では内部の擦れや衝撃痕を確認し、安全性を推理できます。',task:'強調されている表面痕跡ボタンを押してください。',action:'tool',value:'surface'},
          {target:'#guideGuessTarget',title:'判定を入力してください',text:'カテゴリーと安全性を選択すると、実際の内容物と判定を比較できます。',task:'カテゴリーと安全性を両方選択してください。',action:'guess'},
          {target:'#guideOpenTarget',title:'箱を開封してください',text:'開封すると箱を一つ消費し、カテゴリーと安全性の正解項目に応じて報酬を獲得します。',task:'強調されている開封ボタンを押してください。',action:'open'},
          {target:'#resultLayer .result-card',title:'精算表を確認してください',text:'カテゴリーと安全性の報酬は、星等級ごとの最大報酬を半分ずつに分けて計算します。',task:'精算内容を確認すると最初の業務が終了します。',action:'complete'}
        ]
      }
    };
    const currentTutorial=()=>tutorialText[currentLanguage]||tutorialText.ko;
    const inspectionGuideSteps=()=>currentTutorial().steps;
    function renderGuideProgress(total,current){guideProgress.innerHTML=Array.from({length:total},(_,i)=>`<span class="${i<=current?'done':''}"></span>`).join('')}
    function positionGuide(targetSelector,title,text,kicker='FIRST SHIFT',task='강조된 부분을 확인하세요.'){
      const target=$(targetSelector);if(!target)return;const rect=target.getBoundingClientRect(),pad=8;
      guideFocus.style.left=`${rect.left-pad}px`;guideFocus.style.top=`${rect.top-pad}px`;guideFocus.style.width=`${rect.width+pad*2}px`;guideFocus.style.height=`${rect.height+pad*2}px`;
      guideKicker.textContent=kicker;guideTitle.textContent=title;guideText.textContent=text;guideTask.textContent=task;
      let left=rect.right+18,top=Math.max(18,rect.top);if(left+380>innerWidth-18)left=Math.max(18,rect.left-398);if(top+300>innerHeight-18)top=Math.max(18,innerHeight-318);guideCard.style.left=`${left}px`;guideCard.style.top=`${top}px`;
    }
    function startMainGuide(){if(state.tutorialDone)return;const t=currentTutorial().main;onboardingActive=true;guideMode='main';guideIndex=0;guideOverlay.classList.remove('hidden');guideNext.textContent=t.next;guideNext.disabled=true;renderGuideProgress(9,0);positionGuide('#workerSignature',t.title,t.text,'FIRST SHIFT · 1 / 9',t.task)}
    function startStorageGuide(){const t=currentTutorial().storage;guideMode='storage';guideIndex=0;guideOverlay.classList.remove('hidden');guideNext.textContent=t.next;guideNext.disabled=true;renderGuideProgress(8,0);positionGuide('#buyBoxButton',t.title,t.text,'FIRST SHIFT · 1 / 8',t.task)}
    function startMoveGuide(){const t=currentTutorial().move;guideMode='move';guideIndex=0;guideOverlay.classList.remove('hidden');guideNext.textContent=t.next;guideNext.disabled=true;renderGuideProgress(8,1);positionGuide('#goInspectionButton',t.title,t.text,'FIRST SHIFT · 2 / 8',t.task)}
    function startInspectionGuide(){guideMode='inspection';guideIndex=0;guideOverlay.classList.remove('hidden');updateInspectionGuide()}
    function updateInspectionGuide(){const step=inspectionGuideSteps()[guideIndex],buttons=currentTutorial().buttons;guideNext.disabled=step.action!=='next'&&step.action!=='complete';guideNext.textContent=step.action==='next'?buttons.next:step.action==='complete'?buttons.complete:buttons.action;renderGuideProgress(8,guideIndex+2);positionGuide(step.target,step.title,step.text,`FIRST SHIFT · ${guideIndex+3} / 8`,step.task)}
    function advanceInspectionGuide(expectedAction,value=''){
      if(!onboardingActive||guideMode!=='inspection')return;
      const steps=inspectionGuideSteps(),step=steps[guideIndex];if(!step||step.action!==expectedAction)return;if(value&&step.value!==value)return;
      if(guideIndex<steps.length-1){guideIndex++;setTimeout(updateInspectionGuide,220)}
    }
    function closeGuide(complete=false){guideOverlay.classList.add('hidden');if(complete){onboardingActive=false;state.tutorialDone=true;saveState();updateMainFirstRun()}}
    guideNext.onclick=()=>{if(guideMode==='inspection'){const step=inspectionGuideSteps()[guideIndex];if(step.action==='next')advanceInspectionGuide('next');else if(step.action==='complete')closeGuide(true)}};
    guideSkip.onclick=()=>closeGuide(true);

    createTools();updateGlobalUI();updateStorageUI();beginCurrentBox();renderCollection();updateMainFirstRun();updateSoundButtons();setTimeout(resizeSignaturePad,80);
    const savedLanguage=localStorage.getItem(LANGUAGE_KEY);if(savedLanguage==='ja'||savedLanguage==='ko')$('#languageSelect').dataset.previous=savedLanguage;

    function resizeRenderer(pack,element){const w=element.clientWidth,h=element.clientHeight;if(w<=0||h<=0)return;pack.renderer.setSize(w,h,false);pack.camera.aspect=w/h;pack.camera.updateProjectionMatrix()}
    function resizeInspection(){resizeRenderer(inspectionPack,$('#inspectionScene'))}function resizeStorage(){resizeRenderer(storagePack,$('#storageScene'))}
    addEventListener('resize',()=>{resizeInspection();resizeStorage();resizeSignaturePad();if(!guideOverlay.classList.contains('hidden')){if(guideMode==='storage'){const t=currentTutorial().storage;positionGuide('#buyBoxButton',t.title,t.text,'FIRST SHIFT · 1 / 8',t.task)}else if(guideMode==='move'){const t=currentTutorial().move;positionGuide('#goInspectionButton',t.title,t.text,'FIRST SHIFT · 2 / 8',t.task)}else if(guideMode==='inspection')updateInspectionGuide()}});
    const clock=new THREE.Clock();
    function animate(){requestAnimationFrame(animate);const d=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;
      if(current&&insMode==='idle')inspectionRoot.position.y=.02+Math.sin(t*1.2)*.018;else if(insMode!=='idle'){insTime+=d;const p=Math.min(insTime/.75,1);if(insMode==='lift')inspectionRoot.position.y=.02+Math.sin(p*Math.PI)*.26;else inspectionRoot.rotation.z=Math.sin(p*Math.PI*6)*Math.sin(p*Math.PI)*.035;if(p>=1){insMode='idle';inspectionRoot.position.set(0,.02,0);inspectionRoot.rotation.z=0}}
      if(storageDropAnimation){
        const a=storageDropAnimation;a.time+=d;const p=Math.min(a.time/a.duration,1);const fall=Math.min(p/.72,1);const ease=fall<1?fall*fall:1;const settle=p>.72?(p-.72)/.28:0;
        a.mesh.position.x=a.targetX;a.mesh.position.z=a.targetZ;
        if(p<.72)a.mesh.position.y=THREE.MathUtils.lerp(a.startY,a.targetY,ease);
        else{const bounce=Math.abs(Math.sin(settle*Math.PI*3))*Math.pow(1-settle,2)*.17;a.mesh.position.y=a.targetY+bounce}
        const speedBlur=Math.max(0,1-Math.abs(fall-.62)*2.4);
        a.ghosts.forEach((ghost,index)=>{ghost.position.x=a.targetX;ghost.position.z=a.targetZ;ghost.position.y=a.mesh.position.y+(index+1)*(.18+.09*speedBlur);ghost.rotation.copy(a.mesh.rotation);ghost.visible=p<.82;ghost.traverse(object=>{if(object.material){(Array.isArray(object.material)?object.material:[object.material]).forEach(material=>material.opacity=.045*speedBlur)}})});
        const squash=p>.69&&p<.92?Math.sin((p-.69)/.23*Math.PI):0;const base=THREE.MathUtils.lerp(a.targetScale*.94,a.targetScale,Math.min(p/.72,1));a.mesh.scale.set(base*(1+squash*.07),base*(1-squash*.13),base*(1+squash*.07));a.mesh.rotation.x=(1-p)*.03;a.mesh.rotation.y=THREE.MathUtils.lerp(a.targetRotationY+.025,a.targetRotationY,p);a.mesh.rotation.z=Math.sin(p*Math.PI*2)*(1-p)*.025;
        const impact=p>.69?Math.sin(Math.min((p-.69)/.31,1)*Math.PI):0;storageRoot.position.y=-impact*.035;storageRoot.rotation.z=(a.column-1)*impact*.009;
        storageDropLight.position.set(a.targetX,a.mesh.position.y+1.1,2.25);storageDropLight.intensity=p<.68?speedBlur*1.7:impact*4.2;
        if(p>.7&&p<.76&&!a.flashed){a.flashed=true;const flash=$('#dropFlash');const rect=$('#storageScene').getBoundingClientRect();flash.style.left=`${(a.targetX/4.8+.5)*100}%`;flash.style.top=`${72-a.targetY*5}%`;flash.classList.remove('show');void flash.offsetWidth;flash.classList.add('show')}
        if(p>=1){a.mesh.position.set(a.targetX,a.targetY,a.targetZ);a.mesh.scale.setScalar(a.targetScale);a.mesh.rotation.set(0,a.targetRotationY,0);storageRoot.position.y=0;storageRoot.rotation.z=0;finishStorageDrop()}
      }else{storageRoot.position.y=Math.sin(t*.9)*.008;storageDropLight.intensity=0}
      inspectionPack.renderer.render(inspectionPack.scene,inspectionPack.camera);storagePack.renderer.render(storagePack.scene,storagePack.camera)
    }
    resizeInspection();resizeStorage();animate();

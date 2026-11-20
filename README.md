# စာအုပ်ဖတ်စက် · PDF Book Reader + Nara Mini TTS

PDF ကို **စာအုပ်လို ဖတ်နိုင်**၊ **အသံနဲ့ နားထောင်နိုင်**တဲ့ အခမဲ့ Web App။

**Live ဥပမာ**: GitHub Pages မှာ တင်ပြီး သုံးနိုင်ပါတယ်။

## Features

- PDF Upload (Drag & Drop + File picker)
- Page-by-page စာအုပ်လို UI
- **စာဖတ်** / **အသံနားထောင်** mode ခွဲခြား
- Theme: အလင်း · Sepia · အမှောင်
- စာလုံးအရွယ် + စာကြောင်းအကွာ ချိန်နိုင်
- Keyboard: `←` `→` နဲ့ လှန်နိုင်၊ `Esc` နဲ့ ပြန်ထွက်
- Nara Mini v1 (4 voices) ကို **SagaPyaw** ကနေ တိုက်ရိုက် ဖွင့်သုံးနိုင်
- Browser Web Speech API ကို fallback အဖြစ် သုံးထား

## GitHub Pages မှာ တင်နည်း (အဆင့်ဆင့်)

### 1. Repository အသစ် ဖန်တီးပါ

1. GitHub မှာ **New repository** နှိပ်
2. နာမည်ဥပမာ: `pdf-book-reader`
3. Public ရွေး
4. **Create repository**

### 2. ဖိုင်တွေ တင်ပါ

**နည်းလမ်း A – GitHub Website ကနေ**

1. Repository ထဲ ဝင်
2. **Add file → Upload files**
3. ဒီ folder ထဲက ဖိုင်အားလုံး (`index.html`, `css/`, `js/`, `README.md`) ကို ဆွဲထည့်
4. Commit လုပ်

**နည်းလမ်း B – Git command**

```bash
git clone https://github.com/YOUR_USERNAME/pdf-book-reader.git
cd pdf-book-reader

# ဖိုင်တွေကို ဒီ folder ထဲ ကူးထည့်

git add .
git commit -m "Initial: PDF Book Reader + Nara Mini TTS"
git push origin main
```

### 3. GitHub Pages ဖွင့်ပါ

1. Repository → **Settings** → ဘယ်ဘက် **Pages**
2. **Source**: `Deploy from a branch`
3. Branch: `main` (သို့မဟုတ် `master`)
4. Folder: `/ (root)`
5. **Save**

မိနစ်အနည်းငယ် စောင့်ပါ။ ပြီးရင် link က ဒီလို ထွက်လာမယ်:

```
https://YOUR_USERNAME.github.io/pdf-book-reader/
```

### 4. သုံးပါ

အပေါ်က link ကို ဖွင့်ပြီး PDF တင်ပါ။

---

## အသံ (TTS) ဘယ်လို အလုပ်လုပ်သလဲ

| ခလုတ် | လုပ်ဆောင်ချက် |
|--------|----------------|
| **▶ ဒီစာမျက်နှာ ဖတ်ပြ** | Browser ရဲ့ Web Speech API သုံးပြီး ချက်ချင်း ဖတ်ပြ (အရည်အသွေးက device ပေါ် မူတည်) |
| **SagaPyaw မှာ ဖွင့်** | လက်ရှိစာမျက်နှာ + ရွေးထားတဲ့ voice ကို [SagaPyaw](https://sagapyaw.sagapyaw.workers.dev) သို့ ပို့ပြီး **Nara Mini v1** အရည်အသွေးမြင့် အသံနဲ့ နားထောင်နိုင် |

SagaPyaw က browser ထဲမှာပဲ Nara Mini ONNX model ကို run တာမို့ Backend မလိုပါဘူး။

---

## ဖိုင်ဖွဲ့စည်းပုံ

```
pdf-book-reader/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md
```

အရမ်းပေါ့ပါးပါတယ် (model တွေ မပါလို့)။ GitHub Pages အတွက် အသင့်ပါ။

---

## License & Credit

- **Nara Mini v1** → Apache-2.0 · [YeeNyunn/nara-mini-v1](https://huggingface.co/YeeNyunn/nara-mini-v1)
- **SagaPyaw** → [kowinhtike/SagaPyaw](https://github.com/kowinhtike/SagaPyaw)
- PDF.js · Mozilla

---

မေးစရာရှိရင် ပြောပါ။  
ကောင်းမွန်စွာ သုံးနိုင်ပါစေ 📖

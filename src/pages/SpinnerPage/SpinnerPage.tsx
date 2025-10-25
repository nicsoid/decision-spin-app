import React, { useState, useEffect, useRef, useCallback } from "react";
// Import only the types needed that are likely available globally or easily defined
import type { InvoiceStatus } from "@tma.js/sdk"; // Keep type if available

// --- Local Type Definitions to avoid problematic imports ---
// Define a subset of ThemeParams based on usage
interface LocalThemeParams {
  backgroundColor?: string;
  textColor?: string;
  hintColor?: string;
  linkColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  secondaryBackgroundColor?: string;
  // Add other theme keys if used elsewhere
}

// Define the WebApp interface locally based on usage
interface CustomWebApp {
  initData?: string;
  initDataRaw?: string;
  initDataUnsafe?: {
    query_id?: string;
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      is_premium?: boolean;
      photo_url?: string;
    };
    // Add other properties if needed
  };
  version: string;
  platform: string;
  themeParams: LocalThemeParams; // Use local type
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  // Add methods used
  ready: () => void;
  onEvent: (eventType: "themeChanged" | string, handler: () => void) => void; // Be more specific if possible
  offEvent: (eventType: "themeChanged" | string, handler: () => void) => void;
  sendData: (data: string) => void;
  openLink: (url: string) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (
    url: string,
    callback?: (status: InvoiceStatus) => void
  ) => void; // Use imported type
  showPopup: (params: any, callback?: () => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (
    message: string,
    callback?: (confirmed: boolean) => void
  ) => void;
  // Add components used
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    setParams: (params: any) => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  HapticFeedback: {
    impactOccurred: (
      style: "light" | "medium" | "heavy" | "rigid" | "soft"
    ) => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
  // Add other necessary properties/methods if you use them
}
declare global {
  interface Window {
    Telegram?: {
      WebApp: CustomWebApp; // Use the custom interface
    };
  }
}

// --- Types ---
type LanguageCode = "en" | "uk" | "es" | "de" | "fr" | "zh";

interface TranslationSet {
  title: string;
  heading: string;
  subheading: string;
  spinButton: string;
  placeholder: string;
  footer: string;
  supportTitle: string;
  supportSub: string;
  paymentSuccess: string;
  paymentSuccessMsg: string;
  paymentFailed: string;
  paymentFailedMsg: string;
  addButton: string;
  geminiButton: string;
  geminiLoading: string;
  geminiError: string;
  geminiPrompt: string;
  geminiPromptEmpty: string;
}

type Translations = Record<LanguageCode, TranslationSet>;

// --- Constants ---
const translations: Translations = {
  en: {
    title: "Decision Spinner",
    heading: "Decision Spinner",
    subheading: "Add options and spin the wheel!",
    spinButton: "Spin the Wheel!",
    placeholder: "Add an option...",
    footer: "Built in a day!",
    supportTitle: "Support the App!",
    supportSub: "Donate with Telegram Stars to keep this app running.",
    paymentSuccess: "Payment Successful!",
    paymentSuccessMsg: "Thank you for your support!",
    paymentFailed: "Payment Failed",
    paymentFailedMsg: "Something went wrong. Please try again.",
    addButton: "Add",
    geminiButton: "Suggest Ideas",
    geminiLoading: "Loading suggestions...",
    geminiError: "Error getting suggestions.",
    geminiPrompt:
      'Based on this list for a decision wheel, give me 5 more short, related ideas: {OPTIONS}. Return ONLY a JSON array of 5 strings. For example: ["Idea 1", "Idea 2", "Idea 3", "Idea 4", "Idea 5"]',
    geminiPromptEmpty:
      'Give me 5 short, fun ideas for a decision wheel (e.g., \'Pizza\', \'Movie Night\'). Return ONLY a JSON array of 5 strings. For example: ["Idea 1", "Idea 2", "Idea 3", "Idea 4", "Idea 5"]',
  },
  uk: {
    title: "Колесо Рішень",
    heading: "Колесо Рішень",
    subheading: "Додайте варіанти та крутіть колесо!",
    spinButton: "Крутити колесо!",
    placeholder: "Додати варіант...",
    footer: "Створено за день!",
    supportTitle: "Підтримайте додаток!",
    supportSub: "Пожертвуйте Telegram Stars, щоб цей додаток працював.",
    paymentSuccess: "Оплата Успішна!",
    paymentSuccessMsg: "Дякуємо за вашу підтримку!",
    paymentFailed: "Помилка Оплати",
    paymentFailedMsg: "Щось пішло не так. Будь ласка, спробуйте ще раз.",
    addButton: "Додати",
    geminiButton: "Запропонувати ідеї",
    geminiLoading: "Завантаження пропозицій...",
    geminiError: "Помилка отримання пропозицій.",
    geminiPrompt:
      'На основі цього списку для колеса рішень, дайте мені ще 5 коротких, пов\'язаних ідей: {OPTIONS}. Поверніть ТІЛЬКИ JSON-масив з 5 рядків. Наприклад: ["Ідея 1", "Ідея 2", "Ідея 3", "Ідея 4", "Ідея 5"]',
    geminiPromptEmpty:
      'Дайте мені 5 коротких, веселих ідей для колеса рішень (напр., \'Піца\', \'Вечір кіно\'). Поверніть ТІЛЬКИ JSON-масив з 5 рядків. Наприклад: ["Ідея 1", "Ідея 2", "Ідея 3", "Ідея 4", "Ідея 5"]',
  },
  es: {
    title: "Rueda de Decisiones",
    heading: "Rueda de Decisiones",
    subheading: "¡Añade opciones y gira la rueda!",
    spinButton: "¡Girar la Rueda!",
    placeholder: "Añadir una opción...",
    footer: "¡Hecho en un día!",
    supportTitle: "¡Apoya la App!",
    supportSub: "Dona con Telegram Stars para mantener esta app funcionando.",
    paymentSuccess: "¡Pago Exitoso!",
    paymentSuccessMsg: "¡Gracias por tu apoyo!",
    paymentFailed: "Pago Fallido",
    paymentFailedMsg: "Algo salió mal. Por favor, inténtalo de nuevo.",
    addButton: "Añadir",
    geminiButton: "Sugerir Ideas",
    geminiLoading: "Cargando sugerencias...",
    geminiError: "Error al obtener sugerencias.",
    geminiPrompt:
      'Basado en esta lista para una rueda de decisiones, dame 5 ideas cortas y relacionadas más: {OPTIONS}. Devuelve SÓLO un array JSON de 5 strings. Por ejemplo: ["Idea 1", "Idea 2", "Idea 3", "Idea 4", "Idea 5"]',
    geminiPromptEmpty:
      'Dame 5 ideas cortas y divertidas para una rueda de decisiones (ej. \'Pizza\', \'Noche de cine\'). Devuelve SÓLO un array JSON de 5 strings. Por ejemplo: ["Idea 1", "Idea 2", "Idea 3", "Idea 4", "Idea 5"]',
  },
  de: {
    title: "Entscheidungsrad",
    heading: "Entscheidungsrad",
    subheading: "Optionen hinzufügen und das Rad drehen!",
    spinButton: "Rad drehen!",
    placeholder: "Option hinzufügen...",
    footer: "An einem Tag gebaut!",
    supportTitle: "Unterstütze die App!",
    supportSub: "Spende mit Telegram Stars, damit diese App weiterläuft.",
    paymentSuccess: "Zahlung Erfolgreich!",
    paymentSuccessMsg: "Danke für deine Unterstützung!",
    paymentFailed: "Zahlung Fehlgeschlagen",
    paymentFailedMsg: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
    addButton: "Hinzufügen",
    geminiButton: "Ideen vorschlagen",
    geminiLoading: "Lade Vorschläge...",
    geminiError: "Fehler beim Abrufen von Vorschlägen.",
    geminiPrompt:
      'Basierend auf dieser Liste für ein Entscheidungsrad, gib mir 5 weitere kurze, passende Ideen: {OPTIONS}. Gib NUR ein JSON-Array mit 5 Strings zurück. Zum Beispiel: ["Idee 1", "Idee 2", "Idee 3", "Idee 4", "Idee 5"]',
    geminiPromptEmpty:
      'Gib mir 5 kurze, unterhaltsame Ideen für ein Entscheidungsrad (z.B. \'Pizza\', \'Filmabend\'). Gib NUR ein JSON-Array mit 5 Strings zurück. Zum Beispiel: ["Idee 1", "Idee 2", "Idee 3", "Idee 4", "Idee 5"]',
  },
  fr: {
    title: "Roue de Décision",
    heading: "Roue de Décision",
    subheading: "Ajoutez des options et tournez la roue !",
    spinButton: "Tourner la roue !",
    placeholder: "Ajouter une option...",
    footer: "Fait en un jour !",
    supportTitle: "Soutenez l'application !",
    supportSub:
      "Faites un don avec Telegram Stars pour que cette application continue de fonctionner.",
    paymentSuccess: "Paiement Réussi !",
    paymentSuccessMsg: "Merci pour votre soutien !",
    paymentFailed: "Échec du Paiement",
    paymentFailedMsg: "Quelque chose s'est mal passé. Veuillez réessayer.",
    addButton: "Ajouter",
    geminiButton: "Suggérer des idées",
    geminiLoading: "Chargement des suggestions...",
    geminiError: "Erreur lors de la récupération des suggestions.",
    geminiPrompt:
      'Basé sur cette liste pour une roue de décision, donnez-moi 5 autres idées courtes et liées : {OPTIONS}. Retournez UNIQUEMENT un tableau JSON de 5 chaînes. Par exemple : ["Idée 1", "Idée 2", "Idée 3", "Idée 4", "Idée 5"]',
    geminiPromptEmpty:
      'Donnez-moi 5 idées courtes et amusantes pour une roue de décision (par ex. \'Pizza\', \'Soirée ciné\'). Retournez UNIQUEMENT un tableau JSON de 5 chaînes. Par exemple : ["Idée 1", "Idée 2", "Idée 3", "Idée 4", "Idée 5"]',
  },
  zh: {
    title: "决策转盘",
    heading: "决策转盘",
    subheading: "添加选项，转动转盘！",
    spinButton: "转动转盘！",
    placeholder: "添加一个选项...",
    footer: "一天之内建成！",
    supportTitle: "支持本应用！",
    supportSub: "使用 Telegram Stars 捐款，让本应用得以持续运行。",
    paymentSuccess: "支付成功！",
    paymentSuccessMsg: "感谢您的支持！",
    paymentFailed: "支付失败",
    paymentFailedMsg: "出了点问题。请再试一次。",
    addButton: "添加",
    geminiButton: "建议创意",
    geminiLoading: "正在加载建议...",
    geminiError: "获取建议时出错。",
    geminiPrompt:
      '根据这个决策轮的列表，再给我5个简短的相关创意：{OPTIONS}。只返回一个包含5个字符串的JSON数组。例如：["创意1", "创意2", "创意3", "创意4", "创意5"]',
    geminiPromptEmpty:
      '给我5个简短有趣的决策轮创意（例如“披萨”，“电影之夜”）。只返回一个包含5个字符串的JSON数组。例如：["创意1", "创意2", "创意3", "创意4", "创意5"]',
  },
};

const colors: string[] = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
];
// Ensure this matches your actual deployed bot server URL
const BOT_SERVER_URL = "https://niksoid.github.com/decision-spin-app/"; // ** IMPORTANT: Update this **

// --- React Component ---
export function SpinnerPage(): JSX.Element {
  // --- State ---
  const [options, setOptions] = useState<string[]>(() => {
    const savedOptions = localStorage.getItem("decisionSpinnerOptions");
    try {
      if (savedOptions) {
        const parsedOptions = JSON.parse(savedOptions);
        if (
          Array.isArray(parsedOptions) &&
          parsedOptions.length > 0 &&
          parsedOptions.every((item) => typeof item === "string")
        )
          return parsedOptions;
      }
    } catch (e) {
      console.error("Failed to parse saved options:", e);
      localStorage.removeItem("decisionSpinnerOptions");
    }
    return ["Pizza 🍕", "Tacos 🌮", "Sushi 🍣", "Pasta 🍝"];
  });
  const [lang, setLang] = useState<LanguageCode>("en");
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [geminiLoading, setGeminiLoading] = useState<boolean>(false);
  const [starsLoading, setStarsLoading] = useState<boolean>(false);
  // Use state for tg object, theme, and readiness flag
  const [tg, setTg] = useState<CustomWebApp | null>(null); // Use CustomWebApp type
  const [themeParams, setThemeParams] = useState<Partial<LocalThemeParams>>({}); // Use local type
  const [isTelegramReady, setIsTelegramReady] = useState<boolean>(false);

  // --- Refs ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cumulativeRotationRef = useRef<number>(0);
  const optionInputRef = useRef<HTMLInputElement | null>(null);

  // Get current translation object
  const t = translations[lang] || translations["en"];

  // --- Helper function to apply CSS variables ---
  const applyCssVariables = useCallback(
    (params: Partial<LocalThemeParams> | null) => {
      const root = document.documentElement;
      // Use property names from LocalThemeParams
      root.style.setProperty(
        "--tg-theme-bg-color",
        params?.backgroundColor || "#ffffff"
      );
      root.style.setProperty(
        "--tg-theme-text-color",
        params?.textColor || "#000000"
      );
      root.style.setProperty(
        "--tg-theme-hint-color",
        params?.hintColor || "#999999"
      );
      root.style.setProperty(
        "--tg-theme-link-color",
        params?.linkColor || "#007aff"
      );
      root.style.setProperty(
        "--tg-theme-button-color",
        params?.buttonColor || "#007aff"
      );
      root.style.setProperty(
        "--tg-theme-button-text-color",
        params?.buttonTextColor || "#ffffff"
      );
      root.style.setProperty(
        "--tg-theme-secondary-bg-color",
        params?.secondaryBackgroundColor || "#f0f0f0"
      );
      document.body.style.backgroundColor =
        params?.backgroundColor || "#ffffff";
    },
    []
  );

  // --- Effects ---

  // 1. Initial Load: Detect TG Environment, Load Options, Set Language, Setup Back Button
  useEffect(() => {
    let telegramApp: CustomWebApp | null = null;
    let themeUpdateHandler: (() => void) | null = null;
    let backButtonHandler: (() => void) | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let attempts = 0;
    const maxAttempts = 5;

    const setupTelegram = (app: CustomWebApp) => {
      if (intervalId) clearInterval(intervalId);
      try {
        app.ready();
        setTg(app); // Set state with the detected app object
        const currentParams = app.themeParams;
        setThemeParams(currentParams); // Set initial theme state
        applyCssVariables(currentParams); // Apply initial theme CSS

        // Check platform readiness with a slight delay if needed
        if (app.platform && app.platform !== "unknown") {
          setIsTelegramReady(true);
          console.log("Telegram Ready Flag SET", app.platform);
        } else {
          // Sometimes platform is set slightly after ready()
          setTimeout(() => {
            // Re-check the platform property on the same app object
            if (app.platform && app.platform !== "unknown") {
              setIsTelegramReady(true);
              console.log(
                "Telegram Ready Flag SET (delayed check)",
                app.platform
              );
            } else {
              console.warn("Telegram platform still unknown after delay.");
              setIsTelegramReady(false); // Explicitly false if still unknown
            }
          }, 300); // 300ms delay for platform property
        }

        // Setup theme change listener
        themeUpdateHandler = () => {
          const updatedParams = app.themeParams;
          setThemeParams(updatedParams); // Update theme state
          applyCssVariables(updatedParams); // Update theme CSS
        };
        app.onEvent("themeChanged", themeUpdateHandler);

        // Setup back button
        app.BackButton.show();
        backButtonHandler = () => window.history.back(); // Simple browser back
        app.BackButton.onClick(backButtonHandler);

        // Determine and set language
        const userLang = (
          app.initDataUnsafe?.user?.language_code ||
          navigator.language ||
          "en"
        ).split("-")[0];
        let defaultLang: LanguageCode = "en";
        if (Object.keys(translations).includes(userLang))
          defaultLang = userLang as LanguageCode;
        const savedLang =
          (localStorage.getItem(
            "decisionSpinnerLang"
          ) as LanguageCode | null) || defaultLang;
        setLang(savedLang);
      } catch (e) {
        console.error("Error setting up Telegram:", e);
        setIsTelegramReady(false); // Set false on error
        applyCssVariables({}); // Apply default styles on error
        determineBrowserLanguage(); // Set language based on browser
      }
    };

    // Helper to set language if TG fails
    const determineBrowserLanguage = () => {
      const browserLang = (navigator.language || "en").split("-")[0];
      let defaultLang: LanguageCode = "en";
      if (Object.keys(translations).includes(browserLang))
        defaultLang = browserLang as LanguageCode;
      const savedLang =
        (localStorage.getItem("decisionSpinnerLang") as LanguageCode | null) ||
        defaultLang;
      setLang(savedLang);
    };

    // Try to detect immediately
    if (window.Telegram && window.Telegram.WebApp) {
      telegramApp = window.Telegram.WebApp;
      setupTelegram(telegramApp);
    } else {
      // Fallback: Check repeatedly for a short period
      intervalId = setInterval(() => {
        attempts++;
        if (window.Telegram && window.Telegram.WebApp) {
          telegramApp = window.Telegram.WebApp;
          setupTelegram(telegramApp); // Setup if found
        } else if (attempts >= maxAttempts) {
          // Stop checking after max attempts
          if (intervalId) clearInterval(intervalId);
          console.warn(
            `TG WebApp not found after ${attempts} attempts. Assuming browser environment.`
          );
          setIsTelegramReady(false); // Definitely not Telegram
          applyCssVariables({}); // Apply default styles
          determineBrowserLanguage(); // Set language based on browser
        }
      }, 500); // Check every 500ms
    }

    // Cleanup function
    return () => {
      if (intervalId) clearInterval(intervalId); // Clear interval if running
      // Use the most recent reference to telegramApp for cleanup
      const appToClean = window.Telegram?.WebApp;
      if (appToClean) {
        // Use the handlers captured in the closure
        if (themeUpdateHandler)
          appToClean.offEvent("themeChanged", themeUpdateHandler);
        if (backButtonHandler && appToClean.BackButton.isVisible) {
          appToClean.BackButton.offClick(backButtonHandler);
          appToClean.BackButton.hide();
        }
      }
    };
  }, [applyCssVariables]); // Run only once on mount, include applyCssVariables in deps

  // 2. Draw Spinner Effect
  useEffect(() => {
    const drawSpinner = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || options.length === 0) return;
      const numOptions = options.length;
      const arc = Math.PI / (numOptions / 2);
      const outsideRadius = 150;
      const textRadius = 110;
      const insideRadius = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Use state themeParams, provide fallbacks
      const currentBtnTextColor = themeParams?.buttonTextColor || "#ffffff";
      const currentHintColor = themeParams?.hintColor || "#999999";

      ctx.strokeStyle = currentHintColor;
      ctx.lineWidth = 1;
      ctx.font = "bold 16px Inter, sans-serif";

      for (let i = 0; i < numOptions; i++) {
        const angle = i * arc;
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(160, 160, outsideRadius, angle, angle + arc, false);
        ctx.arc(160, 160, insideRadius, angle + arc, angle, true);
        ctx.fill();
        ctx.stroke();
        ctx.save();
        ctx.fillStyle = currentBtnTextColor;
        ctx.translate(
          160 + Math.cos(angle + arc / 2) * textRadius,
          160 + Math.sin(angle + arc / 2) * textRadius
        );
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        const text = numOptions > 7 ? (i + 1).toString() : options[i];
        const maxTextWidth = arc * textRadius * 0.8;
        let displayText = text;
        let fontSize = 16;
        if (numOptions < 5) fontSize = 18;
        else if (numOptions > 10) fontSize = 14;
        if (numOptions > 14) fontSize = 12;
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        if (ctx.measureText(text).width > maxTextWidth && text.length > 3) {
          let charsToKeep = Math.floor(
            (text.length * maxTextWidth) / ctx.measureText(text).width
          );
          displayText = text.substring(0, Math.max(1, charsToKeep - 1)) + "…";
          if (ctx.measureText(displayText).width > maxTextWidth)
            displayText = text.substring(0, 1) + "…";
        }
        ctx.fillText(displayText, -ctx.measureText(displayText).width / 2, 0);
        ctx.restore();
        ctx.font = "bold 16px Inter, sans-serif";
      }
    };
    drawSpinner();
    if (options.length > 0 || localStorage.getItem("decisionSpinnerOptions")) {
      localStorage.setItem("decisionSpinnerOptions", JSON.stringify(options));
    }
  }, [options, lang, themeParams]); // Depend on state themeParams

  // 3. Update document title & save language
  useEffect(() => {
    document.title = t.title;
    localStorage.setItem("decisionSpinnerLang", lang);
  }, [t.title, lang]);

  // --- Handlers ---
  const handleAddOption = () => {
    const optionText = optionInputRef.current?.value.trim();
    if (optionText && !options.includes(optionText)) {
      setOptions([...options, optionText]);
    }
    if (optionInputRef.current) optionInputRef.current.value = "";
  };
  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddOption();
  };
  const handleRemoveOption = (indexToRemove: number) => {
    setOptions(options.filter((_, index) => index !== indexToRemove));
  };

  const handleSpin = () => {
    const canvas = canvasRef.current;
    if (isSpinning || !canvas || options.length < 2) return;
    setIsSpinning(true);
    setResult("");
    if (isTelegramReady && tg) tg.HapticFeedback.impactOccurred("light"); // Check flag and tg object
    const randomSpins = Math.floor(Math.random() * 5) + 8;
    const randomDegrees = Math.random() * 360;
    const rotationChange = randomSpins * 360 + randomDegrees;
    const currentCumulativeRotation = cumulativeRotationRef.current;
    const targetCssRotation = currentCumulativeRotation + rotationChange;
    // Apply rotation logic using cumulative rotation
    canvas.style.transition = "none"; // Remove transition before setting new rotation
    canvas.offsetHeight; // Force reflow to apply the no-transition style
    canvas.style.transition = "transform 4.5s cubic-bezier(0.1, 1, 0.3, 1)"; // Re-apply transition
    canvas.style.transform = `rotate(${targetCssRotation}deg)`; // Set final rotation
    cumulativeRotationRef.current = targetCssRotation; // Update cumulative rotation ref

    setTimeout(() => {
      const arcSize = 360 / options.length;
      // Calculate winner based on the final visual angle after animation completes
      const finalAngle = targetCssRotation % 360; // Corrected: use targetCssRotation
      const winningAngle = (360 - finalAngle + 270) % 360;
      const index = Math.floor(winningAngle / arcSize);
      const winnerIndex = index >= 0 && index < options.length ? index : 0;
      setResult(options[winnerIndex]);
      if (isTelegramReady && tg)
        tg.HapticFeedback.notificationOccurred("success");
    }, 4400); // Near the end of the animation
    setTimeout(() => {
      setIsSpinning(false);
    }, 4500); // After animation ends
  };

  // --- Gemini API ---
  const callGeminiApi = async (
    prompt: string,
    maxRetries: number = 3
  ): Promise<string[] | null> => {
    const API_KEY = "AIzaSyD5z_90qKVlOebb0HEouZ3f-qtYJH7QctQ"; // Keep empty for automatic handling
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: { type: "ARRAY", items: { type: "STRING" } },
      },
    };
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
          const jsonText = result.candidates[0].content.parts[0].text;
          try {
            const parsed = JSON.parse(jsonText);
            if (
              Array.isArray(parsed) &&
              parsed.every((item) => typeof item === "string")
            )
              return parsed as string[];
            throw new Error("Parsed JSON not string array.");
          } catch (parseError) {
            throw new Error(`Invalid JSON: ${parseError}`);
          }
        } else {
          throw new Error("Invalid API response structure.");
        }
      } catch (error) {
        console.error(`Gemini API call ${attempt} failed:`, error);
        if (attempt === maxRetries) return null;
        await new Promise((resolve) =>
          setTimeout(
            resolve,
            Math.pow(2, attempt) * 1000 + Math.random() * 1000
          )
        );
      }
    }
    return null;
  };

  const handleGeminiSuggestions = async () => {
    setGeminiLoading(true);
    // Use tg state object
    if (isTelegramReady && tg) tg.MainButton.showProgress();
    let prompt: string;
    if (options.length > 0) {
      const optionsString = options.slice(0, 15).join(", ");
      prompt = t.geminiPrompt.replace("{OPTIONS}", optionsString);
    } else {
      prompt = t.geminiPromptEmpty;
    }
    try {
      const suggestions = await callGeminiApi(prompt);
      if (suggestions) {
        const newOptions = suggestions
          .map((idea) => idea.trim())
          .filter((idea) => idea.length > 0 && idea.length < 50)
          .filter(
            (idea, index, self) =>
              idea &&
              self.findIndex((i) => i.toLowerCase() === idea.toLowerCase()) ===
                index
          )
          .filter(
            (idea) =>
              !options.some((opt) => opt.toLowerCase() === idea.toLowerCase())
          );
        if (newOptions.length > 0) {
          setOptions((prev) => [...prev, ...newOptions.slice(0, 5)]);
          if (isTelegramReady && tg)
            tg.HapticFeedback.notificationOccurred("success");
        } else {
          if (isTelegramReady && tg) {
            tg.showPopup({
              title: "Info",
              message: "No new unique suggestions found.",
            });
            tg.HapticFeedback.notificationOccurred("warning");
          } else {
            alert("No new unique suggestions found.");
          }
        }
        if (canvasRef.current) {
          canvasRef.current.style.transform = `${
            canvasRef.current.style.transform || ""
          } scale(1.05)`;
          setTimeout(() => {
            if (canvasRef.current)
              canvasRef.current.style.transform = (
                canvasRef.current.style.transform || ""
              ).replace(" scale(1.05)", "");
          }, 200);
        }
      } else {
        throw new Error("Failed to get valid suggestions after retries.");
      }
    } catch (error) {
      console.error("Error handling Gemini:", error);
      const msg = `${t.geminiError} ${(error as Error).message || ""}`.trim();
      if (isTelegramReady && tg) {
        tg.showPopup({ title: "Error", message: msg });
        tg.HapticFeedback.notificationOccurred("error");
      } else {
        alert(msg);
      }
    } finally {
      setGeminiLoading(false);
      if (isTelegramReady && tg) tg.MainButton.hideProgress();
    }
  };

  // --- Telegram Stars ---
  const requestDonation = async (amount: number) => {
    // Use tg state object and isTelegramReady flag
    const initDataForRequest = tg?.initDataRaw || tg?.initData;
    if (!isTelegramReady || !tg || !initDataForRequest) {
      console.warn(
        "Telegram environment not ready or initData missing for donation."
      );
      alert("Donations only available within Telegram or initData is missing.");
      return;
    }
    setStarsLoading(true);
    tg.MainButton.showProgress();
    tg.HapticFeedback.impactOccurred("light");
    try {
      const response = await fetch(`${BOT_SERVER_URL}/create-invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount, initData: initDataForRequest }),
      });
      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Invoice creation failed: ${response.status}. ${body}`);
      }
      const { invoiceUrl } = await response.json();
      if (!invoiceUrl || typeof invoiceUrl !== "string")
        throw new Error("Invalid invoice URL from server.");

      // Use tg object to open invoice
      tg.openInvoice(invoiceUrl, (status: InvoiceStatus) => {
        // Add explicit type for status
        handleInvoiceClose(status); // Call separate handler
      });
    } catch (error: unknown) {
      // Use unknown for catch block error
      console.error("Donation error:", error);
      // Type assertion for error message
      const msg = `Donation failed: ${
        (error instanceof Error ? error.message : String(error)) || "Unknown"
      }.`;
      tg.showPopup({ title: "Error", message: msg });
      setStarsLoading(false);
      tg.MainButton.hideProgress();
      tg.HapticFeedback.notificationOccurred("error");
    }
  };

  // Callback for when the invoice popup closes
  // Define outside requestDonation to be accessible
  const handleInvoiceClose = (status: InvoiceStatus) => {
    if (!tg) return; // Guard against tg being null
    setStarsLoading(false);
    tg.MainButton.hideProgress();

    if (status === "paid") {
      tg.showPopup({ title: t.paymentSuccess, message: t.paymentSuccessMsg });
      tg.HapticFeedback.notificationOccurred("success");
    } else if (status === "failed" || status === "pending") {
      tg.showPopup({
        title: t.paymentFailed,
        message: `${t.paymentFailedMsg} (Status: ${status})`,
      });
      tg.HapticFeedback.notificationOccurred("error");
    } else if (status === "cancelled") {
      tg.HapticFeedback.notificationOccurred("warning");
    } else {
      console.warn("Unexpected invoice status:", status);
      tg.showPopup({ title: "Info", message: `Status: ${status}` });
      tg.HapticFeedback.notificationOccurred("warning");
    }
  };

  // --- Render ---
  return (
    <React.Fragment>
      {/* --- STYLE DEFINITIONS --- */}
      <style>{`
                 body { background-color: var(--tg-theme-bg-color, #ffffff); color: var(--tg-theme-text-color, #000000); margin: 0; font-family: Inter, sans-serif; overscroll-behavior: none; }
                html, body, #root { height: 100%; }
                .card { background-color: var(--tg-theme-secondary-bg-color, #f0f0f0); color: var(--tg-theme-text-color, #000000); }
                .input-field, .lang-select { background-color: var(--tg-theme-bg-color, #ffffff); color: var(--tg-theme-text-color, #000000); border: 1px solid var(--tg-theme-hint-color, #999999); border-radius: 0.5rem; }
                .lang-select:focus, .input-field:focus { outline: 2px solid var(--tg-theme-button-color, #007aff); outline-offset: 1px; border-color: transparent; }
                .button-primary { background-color: var(--tg-theme-button-color, #007aff); color: var(--tg-theme-button-text-color, #ffffff); border-radius: 0.5rem; }
                .button-primary:disabled { opacity: 0.6; cursor: not-allowed; }
                .button-primary:hover:not(:disabled) { filter: brightness(110%); }
                .button-secondary { background-color: var(--tg-theme-secondary-bg-color, #f0f0f0); color: var(--tg-theme-text-color, #000000); border: 1px solid var(--tg-theme-hint-color, #999999); border-radius: 0.5rem; }
                .button-secondary:disabled { opacity: 0.6; cursor: not-allowed; }
                .button-secondary:hover:not(:disabled) { filter: brightness(95%); }
                .option-tag { background-color: var(--tg-theme-bg-color, #ffffff); color: var(--tg-theme-text-color, #000000); border: 1px solid var(--tg-theme-hint-color, #999999); align-items: center; box-sizing: border-box; }
                .option-tag button { padding-left: 0.25rem; padding-right: 0.25rem; }
                .spinner-arrow { width: 0; height: 0; border-left: 15px solid transparent; border-right: 15px solid transparent; border-top: 25px solid var(--tg-theme-button-color, #007aff); }
                #options-legend ol li { color: var(--tg-theme-text-color, #000000); }
                #options-legend { background-color: var(--tg-theme-bg-color, #ffffff); border: 1px solid var(--tg-theme-hint-color, #999999); }
                #options-legend::-webkit-scrollbar { display: none; }
                #options-legend { -ms-overflow-style: none; scrollbar-width: none; }
                .focus\\:ring-indigo-500:focus { --tw-ring-color: var(--tg-theme-button-color, #007aff); box-shadow: 0 0 0 2px var(--tw-ring-color); outline: none; }
            `}</style>

      <div className="flex flex-col items-center justify-start min-h-screen p-4 pt-8 overflow-x-hidden">
        {/* Visual Debugger (Optional) */}
        {/* <p style={{ position: 'fixed', top: 0, left: 0, background: 'rgba(0,0,0,0.7)', color: 'lime', padding: '2px 5px', fontSize: '10px', zIndex: 1000 }}>
                    Is TG Ready: {isTelegramReady ? 'Yes' : 'No'} | Platform: {tg?.platform || 'N/A'}
                 </p> */}

        {/* Language Selector */}
        <div className="w-full max-w-md mx-auto mb-4">
          <select
            id="lang-select"
            className="lang-select w-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
            value={lang}
            onChange={(e) => setLang(e.target.value as LanguageCode)}
          >
            <option value="en">English (English)</option>
            <option value="uk">Українська (Ukrainian)</option>
            <option value="es">Español (Spanish)</option>
            <option value="de">Deutsch (German)</option>
            <option value="fr">Français (French)</option>
            <option value="zh">中文 (Chinese)</option>
          </select>
        </div>

        {/* Main Card */}
        <div className="card w-full max-w-md mx-auto rounded-2xl p-6 text-center shadow-lg mb-4">
          <h1 className="text-3xl font-bold mb-2">{t.heading}</h1>
          <p
            className="mb-6 text-sm"
            style={{ color: "var(--tg-theme-hint-color)" }}
          >
            {t.subheading}
          </p>
          <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto mb-6">
            <div className="spinner-arrow absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10"></div>
            <canvas
              ref={canvasRef}
              id="spinner-canvas"
              width="320"
              height="320"
              className=""
              style={{ transformOrigin: "center center" }}
            ></canvas>
          </div>
          <div
            className={`text-2xl font-semibold my-4 h-8 transition-opacity duration-300 ${
              result ? "opacity-100" : "opacity-0"
            }`}
          >
            {result || " "}
          </div>
          <button
            id="spin-btn"
            className="button-primary w-full font-bold py-3 px-4 text-lg transition transform active:scale-95 disabled:opacity-60 shadow-md"
            onClick={handleSpin}
            disabled={isSpinning || options.length < 2}
          >
            {" "}
            {t.spinButton}{" "}
          </button>
          <div className="mt-6">
            <div className="flex gap-2">
              <input
                type="text"
                id="option-input"
                ref={optionInputRef}
                className="input-field flex-grow px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
                placeholder={t.placeholder}
                onKeyPress={handleInputKeyPress}
              />
              <button
                id="add-btn"
                className="button-secondary font-bold py-2 px-4 transition transform active:scale-95"
                onClick={handleAddOption}
              >
                {t.addButton}
              </button>
            </div>
            <button
              id="gemini-btn"
              className="button-primary w-full font-bold py-2 px-4 text-sm mt-3 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-60 shadow-sm"
              onClick={handleGeminiSuggestions}
              disabled={geminiLoading}
            >
              {geminiLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  {" "}
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>{" "}
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>{" "}
                </svg>
              ) : (
                "✨"
              )}
              <span>{geminiLoading ? t.geminiLoading : t.geminiButton}</span>
            </button>
          </div>
          <div className="mt-4 w-full">
            {options.length <= 7 ? (
              <div
                id="options-container"
                className="flex flex-wrap justify-center gap-2"
              >
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="option-tag rounded-full px-3 py-1 flex items-center gap-1 text-sm"
                  >
                    <span className="truncate max-w-[100px]">{option}</span>
                    <button
                      className="text-red-500 hover:text-red-700 font-bold leading-none text-lg"
                      onClick={() => handleRemoveOption(index)}
                      aria-label={`Remove ${option}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                id="options-legend"
                className="text-left w-full max-h-32 overflow-y-auto border rounded-lg p-2 mt-2"
              >
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {options.map((option, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center group"
                    >
                      <span className="truncate pr-2">
                        {index + 1}. {option}
                      </span>
                      <button
                        className="text-red-400 hover:text-red-600 font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity px-1"
                        onClick={() => handleRemoveOption(index)}
                        aria-label={`Remove ${option}`}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Telegram Stars Donation Section */}
        {isTelegramReady && (
          <div className="card w-full max-w-md mx-auto rounded-2xl p-6 text-center mt-4 shadow-lg mb-4">
            <h2 className="text-xl font-bold mb-1">{t.supportTitle}</h2>
            <p
              className="mb-4 text-sm"
              style={{ color: "var(--tg-theme-hint-color)" }}
            >
              {t.supportSub}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => requestDonation(100)}
                className="button-secondary p-3 text-sm transition transform active:scale-95 disabled:opacity-60"
                disabled={starsLoading}
              >
                {" "}
                {starsLoading ? "..." : "☕ 100 ✨"}{" "}
              </button>
              <button
                onClick={() => requestDonation(500)}
                className="button-secondary p-3 text-sm transition transform active:scale-95 disabled:opacity-60"
                disabled={starsLoading}
              >
                {" "}
                {starsLoading ? "..." : "🚀 500 ✨"}{" "}
              </button>
            </div>
          </div>
        )}

        <footer
          className="mt-4 text-center text-xs"
          style={{ color: "var(--tg-theme-hint-color)" }}
        >
          <p>{t.footer}</p>
        </footer>
      </div>
    </React.Fragment>
  );
}

import React, { useState, useEffect } from 'react';
import { Moon, Sun, User, Target, Activity, Apple, LifeBuoy, ShieldAlert, Heart, Utensils, CheckIcon, ChevronDownIcon, CircleIcon, Flame, Zap, Star, ArrowRight, ArrowLeft, LogOut } from 'lucide-react';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import { auth } from './lib/supabase';
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Início dos Componentes e Funções Embutidos ---

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const translations = {
  pt: {
    personalInfo: "Dados Pessoais",
    objectives: "Objetivos",
    dailyRoutine: "Rotina",
    physicalActivity: "Exercícios",
    foodPreferences: "Preferências",
    restrictions: "Restrições",
    currentEating: "Alimentação",
    summary: "Concluir",
    step: "Passo",
    of: "de",
    previous: "Anterior",
    next: "Próximo",
    submit: "Gerar Dieta",
    loading: "Gerando...",
    quizSubmitted: "Dieta Criada!",
    successMessage: "Sua dieta personalizada está sendo preparada pela nossa IA.",
    fullName: "Nome",
    fullNamePlaceholder: "Seu nome completo",
    age: "Idade",
    agePlaceholder: "Ex: 25",
    gender: "Sexo",
    genderSelect: "Selecione",
    male: "Masculino",
    female: "Feminino",
    other: "Outro",
    height: "Altura (cm)",
    heightPlaceholder: "175",
    currentWeight: "Peso Atual (kg)",
    currentWeightPlaceholder: "70",
    targetWeight: "Peso Meta (kg)",
    targetWeightPlaceholder: "65",
    mainGoal: "Seu objetivo principal?",
    loseWeight: "Perder peso",
    gainMuscle: "Ganhar massa",
    maintainWeight: "Manter peso",
    improveHealth: "Melhorar saúde",
    wakeUpTime: "Acorda às?",
    sleepTime: "Dorme às?",
    mealsPerDay: "Refeições por dia?",
    "3meals": "3", "4meals": "4", "5meals": "5", "6meals": "6+",
    exerciseRegularly: "Exercita regularmente?",
    yes: "Sim",
    no: "Não",
    sometimes: "Às vezes",
    exerciseType: "Tipos de exercício:",
    weightTraining: "Musculação",
    cardio: "Cardio",
    yogaPilates: "Yoga/Pilates",
    sports: "Esportes",
    vegetarian: "Vegetariano?",
    vegan: "Vegano?",
    favoriteFoods: "Alimentos favoritos:",
    favoriteFoodsPlaceholder: "Ex: frango, brócolos, aveia...",
    cookingSkill: "Habilidade culinária:",
    beginner: "Iniciante",
    intermediate: "Intermediário",
    advanced: "Avançado",
    allergies: "Alergias alimentares:",
    allergiesPlaceholder: "Liste suas alergias...",
    intolerances: "Intolerâncias:",
    intolerancesPlaceholder: "Ex: lactose, glúten...",
    dislikedFoods: "Alimentos a evitar:",
    dislikedFoodsPlaceholder: "Liste alimentos que não gosta...",
    currentBreakfast: "Café da manhã típico:",
    currentBreakfastPlaceholder: "Descreva seu café...",
    currentLunch: "Almoço típico:",
    currentLunchPlaceholder: "Descreva seu almoço...",
    currentDinner: "Jantar típico:",
    currentDinnerPlaceholder: "Descreva seu jantar...",
    waterIntake: "Água por dia (L):",
    waterIntakePlaceholder: "2.5",
    finalTitle: "Tudo pronto!",
    finalMessage: "Revise suas informações e clique em 'Gerar Dieta' para criar seu plano personalizado.",
  },
  en: {
    personalInfo: "Personal Data",
    objectives: "Goals",
    dailyRoutine: "Routine",
    physicalActivity: "Exercise",
    foodPreferences: "Preferences",
    restrictions: "Restrictions",
    currentEating: "Current Diet",
    summary: "Complete",
    step: "Step",
    of: "of",
    previous: "Previous",
    next: "Next",
    submit: "Generate Diet",
    loading: "Generating...",
    quizSubmitted: "Diet Created!",
    successMessage: "Your personalized diet is being prepared by our AI.",
    fullName: "Name",
    fullNamePlaceholder: "Your full name",
    age: "Age",
    agePlaceholder: "25",
    gender: "Gender",
    genderSelect: "Select",
    male: "Male",
    female: "Female",
    other: "Other",
    height: "Height (cm)",
    heightPlaceholder: "175",
    currentWeight: "Current Weight (kg)",
    currentWeightPlaceholder: "70",
    targetWeight: "Target Weight (kg)",
    targetWeightPlaceholder: "65",
    mainGoal: "Your main goal?",
    loseWeight: "Lose weight",
    gainMuscle: "Gain muscle",
    maintainWeight: "Maintain weight",
    improveHealth: "Improve health",
    wakeUpTime: "Wake up at?",
    sleepTime: "Sleep at?",
    mealsPerDay: "Meals per day?",
    "3meals": "3", "4meals": "4", "5meals": "5", "6meals": "6+",
    exerciseRegularly: "Exercise regularly?",
    yes: "Yes",
    no: "No",
    sometimes: "Sometimes",
    exerciseType: "Exercise types:",
    weightTraining: "Weight Training",
    cardio: "Cardio",
    yogaPilates: "Yoga/Pilates",
    sports: "Sports",
    vegetarian: "Vegetarian?",
    vegan: "Vegan?",
    favoriteFoods: "Favorite foods:",
    favoriteFoodsPlaceholder: "E.g., chicken, broccoli, oats...",
    cookingSkill: "Cooking skills:",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    allergies: "Food allergies:",
    allergiesPlaceholder: "List your allergies...",
    intolerances: "Intolerances:",
    intolerancesPlaceholder: "E.g., lactose, gluten...",
    dislikedFoods: "Foods to avoid:",
    dislikedFoodsPlaceholder: "List foods you don't like...",
    currentBreakfast: "Typical breakfast:",
    currentBreakfastPlaceholder: "Describe your breakfast...",
    currentLunch: "Typical lunch:",
    currentLunchPlaceholder: "Describe your lunch...",
    currentDinner: "Typical dinner:",
    currentDinnerPlaceholder: "Describe your dinner...",
    waterIntake: "Water per day (L):",
    waterIntakePlaceholder: "2.5",
    finalTitle: "All set!",
    finalMessage: "Review your information and click 'Generate Diet' to create your personalized plan.",
  }
};

const Sidebar = ({ t, currentStep }) => {
  const menuItems = [
    { label: t.personalInfo, icon: User, step: 1 },
    { label: t.objectives, icon: Target, step: 2 },
    { label: t.dailyRoutine, icon: Activity, step: 3 },
    { label: t.physicalActivity, icon: Zap, step: 4 },
    { label: t.foodPreferences, icon: Heart, step: 5 },
    { label: t.restrictions, icon: ShieldAlert, step: 6 },
    { label: t.currentEating, icon: Utensils, step: 7 },
    { label: t.summary, icon: Star, step: 8 },
  ];

  return (
    <aside className="w-full lg:w-80 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20 text-card-foreground p-6 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg glass-effect dark:glass-effect-dark">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl">
          <Flame className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          DietIA
        </h2>
      </div>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.step}>
            <div className={cn(
              "flex items-center gap-3 p-4 rounded-xl transition-all duration-200 text-sm font-medium cursor-pointer",
              currentStep === item.step
                ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg transform scale-105"
                : "hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:shadow-md"
            )}>
              <item.icon className={cn(
                "h-5 w-5",
                currentStep === item.step ? "text-white" : "text-blue-600"
              )} />
              <span className="font-semibold">{item.label}</span>
              {currentStep === item.step && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

// --- Componentes da UI ---
const buttonVariants=cva("inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600 shadow-lg hover:shadow-xl transform hover:scale-105",outline:"border-2 border-blue-300 bg-transparent text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/20"},size:{default:"h-12 px-6 py-3",icon:"h-12 w-12"}},defaultVariants:{variant:"default",size:"default"}});const Button=React.forwardRef(({className,variant,size,asChild=false,...props},ref)=>{const Comp=asChild?Slot:"button";return<Comp className={cn(buttonVariants({variant,size,className}))}ref={ref}{...props}/>});Button.displayName="Button";
const Input=React.forwardRef(({className,type,...props},ref)=>{return<input type={type}className={cn("flex h-12 w-full rounded-xl border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm font-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",className)}ref={ref}{...props}/>});Input.displayName="Input";
const Label=React.forwardRef(({className,...props},ref)=>(<LabelPrimitive.Root ref={ref}className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",className)}{...props}/>));Label.displayName=LabelPrimitive.Root.displayName;
const Select=SelectPrimitive.Root;const SelectValue=SelectPrimitive.Value;const SelectTrigger=React.forwardRef(({className,children,...props},ref)=>(<SelectPrimitive.Trigger ref={ref}className={cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",className)}{...props}>{children}<SelectPrimitive.Icon asChild><ChevronDownIcon className="h-4 w-4 opacity-50"/></SelectPrimitive.Icon></SelectPrimitive.Trigger>));SelectTrigger.displayName=SelectPrimitive.Trigger.displayName;const SelectContent=React.forwardRef(({className,children,position="popper",...props},ref)=>(<SelectPrimitive.Portal><SelectPrimitive.Content ref={ref}className={cn("relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",position==="popper"&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",className)}position={position}{...props}><SelectPrimitive.Viewport className={cn("p-1",position==="popper"&&"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]")}>{children}</SelectPrimitive.Viewport></SelectPrimitive.Content></SelectPrimitive.Portal>));SelectContent.displayName=SelectPrimitive.Content.displayName;const SelectItem=React.forwardRef(({className,children,...props},ref)=>(<SelectPrimitive.Item ref={ref}className={cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",className)}{...props}><span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"><SelectPrimitive.ItemIndicator><CheckIcon className="h-4 w-4"/></SelectPrimitive.ItemIndicator></span><SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText></SelectPrimitive.Item>));SelectItem.displayName=SelectPrimitive.Item.displayName;
const RadioGroup=React.forwardRef(({className,...props},ref)=>{return(<RadioGroupPrimitive.Root className={cn("grid gap-2",className)}{...props}ref={ref}/>)});RadioGroup.displayName=RadioGroupPrimitive.Root.displayName;const RadioGroupItem=React.forwardRef(({className,...props},ref)=>{return(<RadioGroupPrimitive.Item ref={ref}className={cn("aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",className)}{...props}><RadioGroupPrimitive.Indicator className="flex items-center justify-center"><CircleIcon className="h-2.5 w-2.5 fill-current text-current"/></RadioGroupPrimitive.Indicator></RadioGroupPrimitive.Item>)});RadioGroupItem.displayName=RadioGroupPrimitive.Item.displayName;
const Progress=React.forwardRef(({className,value,...props},ref)=>(<ProgressPrimitive.Root ref={ref}className={cn("relative h-3 w-full overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900/30",className)}{...props}><ProgressPrimitive.Indicator className="h-full w-full flex-1 bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-500 ease-out"style={{transform:`translateX(-${100-(value||0)}%)`}}/></ProgressPrimitive.Root>));Progress.displayName=ProgressPrimitive.Root.displayName;const Separator=React.forwardRef(({className,orientation='horizontal',decorative=true,...props},ref)=>(<SeparatorPrimitive.Root ref={ref}decorative={decorative}orientation={orientation}className={cn('shrink-0 bg-border',orientation==='horizontal'?'h-[1px] w-full':'h-full w-[1px]',className)}{...props}/>));Separator.displayName=SeparatorPrimitive.Root.displayName;
const Checkbox=React.forwardRef(({className,...props},ref)=>(<CheckboxPrimitive.Root ref={ref}className={cn("peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",className)}{...props}><CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}><CheckIcon className="h-4 w-4"/></CheckboxPrimitive.Indicator></CheckboxPrimitive.Root>));Checkbox.displayName=CheckboxPrimitive.Root.displayName;
const Textarea = React.forwardRef(({ className, ...props }, ref) => { return (<textarea className={cn("flex min-h-[100px] w-full rounded-xl border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm font-medium ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none", className)} ref={ref} {...props} />); }); Textarea.displayName = "Textarea";

// --- Fim dos Componentes Embutidos ---

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [language, setLanguage] = useState('pt');
  const [darkMode, setDarkMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Estados de autenticação
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' ou 'register'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Verificar se usuário está logado
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await auth.getCurrentUser();
        setUser(currentUser);
        if (!currentUser) {
          setShowAuth(true);
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
        setShowAuth(true);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Funções de autenticação
  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setShowAuth(true);
      setCurrentStep(1);
      setIsSubmitted(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const [quizData, setQuizData] = useState({
    fullName: '', age: '', gender: '', height: '', currentWeight: '', targetWeight: '',
    mainGoal: '',
    wakeUpTime: '', sleepTime: '', mealsPerDay: '',
    exerciseRegularly: '', exerciseType: { weightTraining: false, cardio: false, yogaPilates: false, sports: false },
    vegetarian: '', vegan: '', favoriteFoods: '', cookingSkill: '',
    allergies: '', intolerances: '', dislikedFoods: '',
    currentBreakfast: '', currentLunch: '', currentDinner: '', waterIntake: '',
  });

  const t = translations[language];
  const totalSteps = 8;
  const progress = isSubmitted ? 100 : ((currentStep - 1) / (totalSteps - 1)) * 100;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setQuizData(prev => ({ ...prev, [id]: value }));
  };

  const handleValueChange = (id, value) => {
    setQuizData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleCheckboxChange = (field, option) => {
    setQuizData(prev => ({ ...prev, [field]: { ...prev[field], [option]: !prev[field][option] } }));
  };

  const computeDailyCalories = () => {
    const heightCm = parseFloat(quizData.height || 0);
    const weightKg = parseFloat(quizData.currentWeight || 0);
    const ageYears = parseInt(quizData.age || 0);
    const gender = quizData.gender || 'male';

    if (!heightCm || !weightKg || !ageYears) return 2000;

    // Mifflin-St Jeor
    const bmr = gender === 'female'
      ? 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161
      : 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
    let tdee = bmr * 1.2; // atividade leve como padrão

    const goal = (quizData.mainGoal || '').toLowerCase();
    if (goal.includes('perder')) tdee -= 300;
    else if (goal.includes('ganhar')) tdee += 300;

    return Math.max(1200, Math.round(tdee));
  };

  const buildPayload = () => {
    // Mapear campos do formulário para os nomes esperados pelo backend
    const selectedExercises = Object.entries(quizData.exerciseType || {})
      .filter(([, checked]) => !!checked)
      .map(([key]) => key);

    // Normalizar objetivo para backend/IA
    const goalMap = {
      'Perder peso': 'perder_peso',
      'Ganhar massa muscular': 'ganhar_massa',
      'Manter o peso': 'manter_peso',
      'Melhorar a saúde': 'manter_peso'
    };

    const normalizedGoal = goalMap[quizData.mainGoal] || quizData.mainGoal || 'manter_peso';

    const payload = {
      name: quizData.fullName,
      age: quizData.age ? parseInt(quizData.age) : undefined,
      gender: quizData.gender,
      height: quizData.height ? parseFloat(quizData.height) : undefined,
      currentWeight: quizData.currentWeight ? parseFloat(quizData.currentWeight) : undefined,
      targetWeight: quizData.targetWeight ? parseFloat(quizData.targetWeight) : undefined,
      mainGoal: normalizedGoal,
      wakeUpTime: quizData.wakeUpTime,
      sleepTime: quizData.sleepTime,
      mealsPerDay: quizData.mealsPerDay,
      exerciseRegularly: quizData.exerciseRegularly,
      exerciseType: selectedExercises,
      favoriteFoods: quizData.favoriteFoods,
      allergies: quizData.allergies,
      intolerances: quizData.intolerances,
      dislikedFoods: quizData.dislikedFoods,
      currentBreakfast: quizData.currentBreakfast,
      currentLunch: quizData.currentLunch,
      currentDinner: quizData.currentDinner,
      waterIntake: quizData.waterIntake ? parseFloat(quizData.waterIntake) : undefined,
      language,
      dailyCalories: computeDailyCalories()
    };

    // Remover chaves undefined para evitar falhas de validação simples
    return Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined && v !== null && v !== ''));
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
        const payload = buildPayload();
        
        // Salvar no Supabase
        const { data: supabaseData, error: supabaseError } = await auth.saveQuizData({
            ...payload,
            user_id: user.id
        });

        if (supabaseError) {
            console.error("Erro ao salvar no Supabase:", supabaseError);
            throw new Error("Erro ao salvar dados");
        }

        console.log("Dados salvos no Supabase:", supabaseData);

        // Enviar para o backend local (opcional)
        try {
            const backendResponse = await fetch('http://localhost:5000/api/quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (backendResponse.ok) {
                const backendResult = await backendResponse.json();
                console.log("Resposta do Backend:", backendResult);
            }
        } catch (backendError) {
            console.warn("Backend local indisponível:", backendError);
        }

        // Enviar para n8n (opcional)
        try {
            const n8nPayload = {
                ...payload,
                user_id: user.id,
                timestamp: new Date().toISOString(),
                source: 'diet-quiz-app',
                version: '1.0.0'
            };

            const n8nResponse = await fetch('https://your-n8n-instance.com/webhook/diet-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(n8nPayload),
            });

            if (n8nResponse.ok) {
                console.log("Dados enviados para n8n com sucesso!");
            }
        } catch (n8nError) {
            console.warn("Erro ao enviar para n8n:", n8nError);
        }

        setIsSubmitted(true);

    } catch (error) {
        console.error("Erro ao enviar o quiz:", error);
        alert(language === 'pt' ? 'Erro ao enviar o formulário. Tente novamente.' : 'Error submitting form. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const getStepTitle = (step) => {
    const titles = [t.personalInfo, t.objectives, t.dailyRoutine, t.physicalActivity, t.foodPreferences, t.restrictions, t.currentEating, t.summary];
    return titles[step - 1] || `Etapa ${step}`;
  };
  
  const getStepIcon = (step) => {
    const icons = [User, Target, Activity, Apple, LifeBuoy, ShieldAlert, Utensils, CheckIcon];
    return icons[step - 1] || User;
  };

  const renderCurrentStep = () => {
    if (isSubmitted) {
      return (
        <div className="text-center flex flex-col items-center justify-center min-h-[400px] space-y-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <Flame className="h-16 w-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <Star className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {t.quizSubmitted}
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t.successMessage}
            </p>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800 max-w-md">
            <div className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
              <span className="font-semibold">
                {language === 'pt' ? 'Processando sua dieta...' : 'Processing your diet...'}
              </span>
            </div>
          </div>
        </div>
      );
    }

    switch(currentStep) {
      case 1: return( 
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {language === 'pt' ? 'Vamos começar!' : "Let's get started!"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'pt' ? 'Precisamos de algumas informações básicas' : 'We need some basic information'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-base font-semibold text-gray-700 dark:text-gray-300">{t.fullName}</Label>
              <Input id="fullName" placeholder={t.fullNamePlaceholder} value={quizData.fullName} onChange={handleInputChange}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age" className="text-base font-semibold text-gray-700 dark:text-gray-300">{t.age}</Label>
              <Input id="age" type="number" placeholder={t.agePlaceholder} value={quizData.age} onChange={handleInputChange}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-base font-semibold text-gray-700 dark:text-gray-300">{t.gender}</Label>
              <Select onValueChange={(v)=>handleValueChange('gender',v)} value={quizData.gender}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t.genderSelect}/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t.male}</SelectItem>
                  <SelectItem value="female">{t.female}</SelectItem>
                  <SelectItem value="other">{t.other}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-base font-semibold text-gray-700 dark:text-gray-300">{t.height}</Label>
              <Input id="height" type="number" placeholder={t.heightPlaceholder} value={quizData.height} onChange={handleInputChange}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentWeight" className="text-base font-semibold text-gray-700 dark:text-gray-300">{t.currentWeight}</Label>
              <Input id="currentWeight" type="number" placeholder={t.currentWeightPlaceholder} value={quizData.currentWeight} onChange={handleInputChange}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetWeight" className="text-base font-semibold text-gray-700 dark:text-gray-300">{t.targetWeight}</Label>
              <Input id="targetWeight" type="number" placeholder={t.targetWeightPlaceholder} value={quizData.targetWeight} onChange={handleInputChange}/>
            </div>
          </div>
        </div>
      );
      case 2: return( 
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {language === 'pt' ? 'Qual é seu objetivo?' : 'What is your goal?'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'pt' ? 'Escolha o que mais se alinha com você' : 'Choose what aligns most with you'}
            </p>
          </div>
          <RadioGroup className="grid grid-cols-1 md:grid-cols-2 gap-4" value={quizData.mainGoal} onValueChange={(v)=>handleValueChange('mainGoal',v)}>
            {[
              { value: t.loseWeight, icon: "🔥", desc: language === 'pt' ? 'Queimar gordura' : 'Burn fat' },
              { value: t.gainMuscle, icon: "💪", desc: language === 'pt' ? 'Construir músculos' : 'Build muscle' },
              { value: t.maintainWeight, icon: "⚖️", desc: language === 'pt' ? 'Manter forma' : 'Stay in shape' },
              { value: t.improveHealth, icon: "❤️", desc: language === 'pt' ? 'Vida saudável' : 'Healthy living' }
            ].map(goal => (
              <div key={goal.value}>
                <RadioGroupItem value={goal.value} id={goal.value} className="peer sr-only"/>
                <Label htmlFor={goal.value} className="flex flex-col items-center justify-center rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-6 hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/30 dark:hover:to-red-900/30 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:from-orange-500 peer-data-[state=checked]:to-red-500 peer-data-[state=checked]:text-white cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 [&:has([data-state=checked])]:border-orange-500 [&:has([data-state=checked])]:from-orange-500 [&:has([data-state=checked])]:to-red-500 [&:has([data-state=checked])]:text-white">
                  <div className="text-4xl mb-3">{goal.icon}</div>
                  <div className="text-lg font-bold text-center">{goal.value}</div>
                  <div className="text-sm text-center opacity-75 mt-1">{goal.desc}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
      case 3: return( 
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {language === 'pt' ? 'Sua rotina diária' : 'Your daily routine'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'pt' ? 'Nos conte sobre seus horários' : 'Tell us about your schedule'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="wakeUpTime" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🌅 {t.wakeUpTime}
              </Label>
              <Input id="wakeUpTime" type="time" value={quizData.wakeUpTime} onChange={handleInputChange}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sleepTime" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🌙 {t.sleepTime}
              </Label>
              <Input id="sleepTime" type="time" value={quizData.sleepTime} onChange={handleInputChange}/>
            </div>
          </div>
          <div className="space-y-4">
            <Label className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              🍽️ {t.mealsPerDay}
            </Label>
            <RadioGroup className="grid grid-cols-2 md:grid-cols-4 gap-3" value={quizData.mealsPerDay} onValueChange={(v)=>handleValueChange('mealsPerDay',v)}>
              {[
                { value: "3", label: t['3meals'], icon: "🥘" },
                { value: "4", label: t['4meals'], icon: "🍽️" },
                { value: "5", label: t['5meals'], icon: "🍴" },
                { value: "6+", label: t['6meals'], icon: "🍎" }
              ].map(meal => (
                <div key={meal.value}>
                  <RadioGroupItem value={meal.value} id={meal.value} className="peer sr-only"/>
                  <Label htmlFor={meal.value} className="flex flex-col items-center justify-center rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-4 hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/30 dark:hover:to-red-900/30 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:from-orange-500 peer-data-[state=checked]:to-red-500 peer-data-[state=checked]:text-white cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 [&:has([data-state=checked])]:border-orange-500 [&:has([data-state=checked])]:from-orange-500 [&:has([data-state=checked])]:to-red-500 [&:has([data-state=checked])]:text-white">
                    <div className="text-2xl mb-2">{meal.icon}</div>
                    <div className="text-sm font-bold">{meal.label}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      );
      case 4: return( 
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {language === 'pt' ? 'Atividade física' : 'Physical activity'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'pt' ? 'Como você se mantém ativo?' : 'How do you stay active?'}
            </p>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                ⚡ {t.exerciseRegularly}
              </Label>
              <RadioGroup className="grid grid-cols-1 md:grid-cols-3 gap-4" value={quizData.exerciseRegularly} onValueChange={(v)=>handleValueChange('exerciseRegularly',v)}>
                {[
                  { value: "yes", label: t.yes, icon: "💪", desc: language === 'pt' ? 'Regularmente' : 'Regularly' },
                  { value: "no", label: t.no, icon: "😴", desc: language === 'pt' ? 'Raramente' : 'Rarely' },
                  { value: "sometimes", label: t.sometimes, icon: "🤔", desc: language === 'pt' ? 'De vez em quando' : 'Sometimes' }
                ].map(exercise => (
                  <div key={exercise.value}>
                    <RadioGroupItem value={exercise.value} id={exercise.value} className="peer sr-only"/>
                    <Label htmlFor={exercise.value} className="flex flex-col items-center justify-center rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-6 hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/30 dark:hover:to-red-900/30 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:from-orange-500 peer-data-[state=checked]:to-red-500 peer-data-[state=checked]:text-white cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 [&:has([data-state=checked])]:border-orange-500 [&:has([data-state=checked])]:from-orange-500 [&:has([data-state=checked])]:to-red-500 [&:has([data-state=checked])]:text-white">
                      <div className="text-3xl mb-2">{exercise.icon}</div>
                      <div className="text-lg font-bold text-center">{exercise.label}</div>
                      <div className="text-sm text-center opacity-75 mt-1">{exercise.desc}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-4">
              <Label className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🏃‍♂️ {t.exerciseType}
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.keys(quizData.exerciseType).map(key => (
                  <div key={key} className="flex items-center space-x-3 p-4 rounded-xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/30 dark:hover:to-red-900/30 transition-all duration-200">
                    <Checkbox 
                      id={key} 
                      checked={quizData.exerciseType[key]} 
                      onCheckedChange={()=>handleCheckboxChange('exerciseType',key)}
                      className="h-5 w-5"
                    />
                    <Label htmlFor={key} className="font-semibold text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
                      {t[key]}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
      case 5: return( 
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {language === 'pt' ? 'Preferências alimentares' : 'Food preferences'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'pt' ? 'Conte-nos sobre seus gostos' : 'Tell us about your tastes'}
            </p>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  🥬 {t.vegetarian}
                </Label>
                <RadioGroup className="flex gap-4" value={quizData.vegetarian} onValueChange={(v)=>handleValueChange('vegetarian',v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="veg-yes"/>
                    <Label htmlFor="veg-yes" className="font-semibold">{t.yes}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="veg-no"/>
                    <Label htmlFor="veg-no" className="font-semibold">{t.no}</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-4">
                <Label className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  🌱 {t.vegan}
                </Label>
                <RadioGroup className="flex gap-4" value={quizData.vegan} onValueChange={(v)=>handleValueChange('vegan',v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="vegan-yes"/>
                    <Label htmlFor="vegan-yes" className="font-semibold">{t.yes}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="vegan-no"/>
                    <Label htmlFor="vegan-no" className="font-semibold">{t.no}</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="space-y-4">
              <Label htmlFor="favoriteFoods" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                ❤️ {t.favoriteFoods}
              </Label>
              <Textarea id="favoriteFoods" placeholder={t.favoriteFoodsPlaceholder} value={quizData.favoriteFoods} onChange={handleInputChange}/>
            </div>
            <div className="space-y-4">
              <Label className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                👨‍🍳 {t.cookingSkill}
              </Label>
              <RadioGroup className="grid grid-cols-1 md:grid-cols-3 gap-4" value={quizData.cookingSkill} onValueChange={(v)=>handleValueChange('cookingSkill',v)}>
                {[
                  { value: "beginner", label: t.beginner, icon: "🌱", desc: language === 'pt' ? 'Básico' : 'Basic' },
                  { value: "intermediate", label: t.intermediate, icon: "👨‍🍳", desc: language === 'pt' ? 'Intermediário' : 'Intermediate' },
                  { value: "advanced", label: t.advanced, icon: "👨‍💼", desc: language === 'pt' ? 'Avançado' : 'Advanced' }
                ].map(skill => (
                  <div key={skill.value}>
                    <RadioGroupItem value={skill.value} id={skill.value} className="peer sr-only"/>
                    <Label htmlFor={skill.value} className="flex flex-col items-center justify-center rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-6 hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/30 dark:hover:to-red-900/30 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:from-orange-500 peer-data-[state=checked]:to-red-500 peer-data-[state=checked]:text-white cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 [&:has([data-state=checked])]:border-orange-500 [&:has([data-state=checked])]:from-orange-500 [&:has([data-state=checked])]:to-red-500 [&:has([data-state=checked])]:text-white">
                      <div className="text-3xl mb-2">{skill.icon}</div>
                      <div className="text-lg font-bold text-center">{skill.label}</div>
                      <div className="text-sm text-center opacity-75 mt-1">{skill.desc}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>
      );
      case 6: return( 
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {language === 'pt' ? 'Restrições alimentares' : 'Food restrictions'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'pt' ? 'Informe sobre alergias e intolerâncias' : 'Tell us about allergies and intolerances'}
            </p>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="allergies" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                ⚠️ {t.allergies}
              </Label>
              <Textarea id="allergies" placeholder={t.allergiesPlaceholder} value={quizData.allergies} onChange={handleInputChange}/>
            </div>
            <div className="space-y-4">
              <Label htmlFor="intolerances" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🚫 {t.intolerances}
              </Label>
              <Textarea id="intolerances" placeholder={t.intolerancesPlaceholder} value={quizData.intolerances} onChange={handleInputChange}/>
            </div>
            <div className="space-y-4">
              <Label htmlFor="dislikedFoods" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                👎 {t.dislikedFoods}
              </Label>
              <Textarea id="dislikedFoods" placeholder={t.dislikedFoodsPlaceholder} value={quizData.dislikedFoods} onChange={handleInputChange}/>
            </div>
          </div>
        </div>
      );
      case 7: return( 
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {language === 'pt' ? 'Sua alimentação atual' : 'Your current diet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'pt' ? 'Descreva seus hábitos alimentares' : 'Describe your eating habits'}
            </p>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="currentBreakfast" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🌅 {t.currentBreakfast}
              </Label>
              <Textarea id="currentBreakfast" placeholder={t.currentBreakfastPlaceholder} value={quizData.currentBreakfast} onChange={handleInputChange}/>
            </div>
            <div className="space-y-4">
              <Label htmlFor="currentLunch" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                ☀️ {t.currentLunch}
              </Label>
              <Textarea id="currentLunch" placeholder={t.currentLunchPlaceholder} value={quizData.currentLunch} onChange={handleInputChange}/>
            </div>
            <div className="space-y-4">
              <Label htmlFor="currentDinner" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                🌙 {t.currentDinner}
              </Label>
              <Textarea id="currentDinner" placeholder={t.currentDinnerPlaceholder} value={quizData.currentDinner} onChange={handleInputChange}/>
            </div>
            <div className="space-y-4">
              <Label htmlFor="waterIntake" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                💧 {t.waterIntake}
              </Label>
              <Input id="waterIntake" type="number" placeholder={t.waterIntakePlaceholder} value={quizData.waterIntake} onChange={handleInputChange}/>
            </div>
          </div>
        </div>
      );
      case 8: return( 
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl">
              <Star className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {t.finalTitle}
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {t.finalMessage}
            </p>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-2xl p-8 border border-orange-200 dark:border-orange-800">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              {language === 'pt' ? 'Resumo das suas informações:' : 'Summary of your information:'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div><strong>{t.fullName}:</strong> {quizData.fullName || '-'}</div>
              <div><strong>{t.age}:</strong> {quizData.age || '-'}</div>
              <div><strong>{t.mainGoal}:</strong> {quizData.mainGoal || '-'}</div>
              <div><strong>{t.mealsPerDay}:</strong> {quizData.mealsPerDay || '-'}</div>
            </div>
          </div>
        </div>
      );
      default: return <p className="text-center py-10 text-muted-foreground">Etapa {currentStep} em construção...</p>;
    }
  };

  // Tela de carregamento
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-teal-950/20">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 animate-pulse">
            <Flame className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'pt' ? 'Carregando...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Tela de autenticação
  if (showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-teal-950/20 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
              <Flame className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
              DietIA
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'pt' ? 'Sua dieta personalizada com IA' : 'Your personalized AI diet'}
            </p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-xl p-8">
            {authMode === 'login' ? (
              <LoginForm 
                onLogin={handleLogin}
                onSwitchToRegister={() => setAuthMode('register')}
                language={language}
              />
            ) : (
              <RegisterForm 
                onRegister={handleRegister}
                onSwitchToLogin={() => setAuthMode('login')}
                language={language}
              />
            )}
          </div>
          
          <div className="text-center mt-6">
            <div className="flex items-center justify-center gap-3">
              <Select onValueChange={setLanguage} value={language}>
                <SelectTrigger className="w-auto h-10 px-3 bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 rounded-xl">
                  <SelectValue>{language==='pt'?'🇧🇷 Português':'🇺🇸 English'}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">🇧🇷 Português</SelectItem>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={()=>setDarkMode(!darkMode)} className="h-10 w-10">
                {darkMode?<Sun className="h-4 w-4"/>:<Moon className="h-4 w-4"/>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen font-sans antialiased bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-teal-950/20 textured-background dark:textured-background-dark", darkMode ? "dark" : "")}>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl shadow-lg">
              <Flame className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                DietIA
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {language === 'pt' ? 'Sua dieta personalizada com IA' : 'Your personalized AI diet'}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            {user && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <User className="h-4 w-4" />
                <span>{user.user_metadata?.name || user.email}</span>
              </div>
            )}
            <Select onValueChange={setLanguage} value={language}>
              <SelectTrigger className="w-auto h-12 px-4 bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 rounded-xl">
                <SelectValue>{language==='pt'?'🇧🇷 Português':'🇺🇸 English'}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">🇧🇷 Português</SelectItem>
                <SelectItem value="en">🇺🇸 English</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={()=>setDarkMode(!darkMode)} className="h-12 w-12">
              {darkMode?<Sun className="h-5 w-5"/>:<Moon className="h-5 w-5"/>}
            </Button>
            {user && (
              <Button variant="outline" size="icon" onClick={handleLogout} className="h-12 w-12">
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </header>
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar t={t} currentStep={currentStep}/>
          <main className="flex-1">
             <div className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-card-foreground rounded-2xl border border-orange-200/50 dark:border-orange-800/50 shadow-xl">
                {!isSubmitted && (
                  <div className="pb-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg">
                        {(()=>{const Icon=getStepIcon(currentStep);return<Icon className="h-8 w-8 text-white"/>})()}
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{getStepTitle(currentStep)}</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">{t.step} {currentStep} {t.of} {totalSteps}</p>
                      </div>
                    </div>
                    <Progress value={progress} className="h-4" />
                  </div>
                )}
                {!isSubmitted && <Separator className="bg-gradient-to-r from-orange-200 to-red-200 dark:from-orange-800 dark:to-red-800 h-0.5"/>}
                <div className="py-8 min-h-[400px]">{renderCurrentStep()}</div>
                {!isSubmitted && (
                  <>
                    <Separator className="bg-gradient-to-r from-orange-200 to-red-200 dark:from-orange-800 dark:to-red-800 h-0.5"/>
                    <div className="flex justify-between items-center pt-8">
                      <Button variant="outline" onClick={prevStep} disabled={currentStep===1} className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        {t.previous}
                      </Button>
                      {currentStep === totalSteps ? (
                        <Button onClick={submitQuiz} disabled={isSubmitting} className="flex items-center gap-2">
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                              {t.loading}
                            </>
                          ) : (
                            <>
                              <Flame className="h-4 w-4" />
                              {t.submit}
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button onClick={nextStep} className="flex items-center gap-2">
                          {t.next}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </>
                )}
             </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;

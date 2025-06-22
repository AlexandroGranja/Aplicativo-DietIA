import React, { useState, useEffect } from 'react';
import { Moon, Sun, User, Target, Activity, Apple, LifeBuoy, ShieldAlert, Heart, Utensils, CheckIcon, ChevronDownIcon, CircleIcon } from 'lucide-react';
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
    personalInfo: "Informações Pessoais",
    objectives: "Objetivos",
    dailyRoutine: "Rotina Diária",
    physicalActivity: "Atividade Física",
    foodPreferences: "Preferências Alimentares",
    restrictions: "Restrições e Alergias",
    currentEating: "Alimentação Atual",
    summary: "Finalizar",
    step: "Etapa",
    of: "de",
    previous: "Anterior",
    next: "Próximo",
    submit: "Enviar Respostas",
    loading: "A enviar...",
   quizSubmitted: "Formulário enviado com sucesso!",
    successMessage: "Obrigado! Sua dieta personalizada será gerada em breve.",
    fullName: "Nome Completo",
    fullNamePlaceholder: "O seu nome completo",
    age: "Idade",
    agePlaceholder: "A sua idade",
    gender: "Sexo",
    genderSelect: "Selecione o seu sexo",
    male: "Masculino",
    female: "Feminino",
    other: "Outro",
    height: "Altura (cm)",
    heightPlaceholder: "Ex: 175",
    currentWeight: "Peso Atual (kg)",
    currentWeightPlaceholder: "Ex: 70.5",
    targetWeight: "Peso Desejado (kg)",
    targetWeightPlaceholder: "Ex: 65",
    mainGoal: "Qual é o seu principal objetivo?",
    loseWeight: "Perder peso",
    gainMuscle: "Ganhar massa muscular",
    maintainWeight: "Manter o peso",
    improveHealth: "Melhorar a saúde",
    wakeUpTime: "A que horas acorda?",
    sleepTime: "A que horas vai dormir?",
    mealsPerDay: "Quantas refeições prefere por dia?",
    "3meals": "3 Refeições", "4meals": "4 Refeições", "5meals": "5 Refeições", "6meals": "6+ Refeições",
    exerciseRegularly: "Pratica exercício físico regularmente?",
    yes: "Sim",
    no: "Não",
    sometimes: "Às vezes",
    exerciseType: "Que tipo de exercício costuma fazer? (Pode marcar vários)",
    weightTraining: "Musculação",
    cardio: "Cardio (Corrida, Ciclismo, etc.)",
    yogaPilates: "Yoga / Pilates",
    sports: "Desportos de equipa",
    vegetarian: "É vegetariano?",
    vegan: "É vegano?",
    favoriteFoods: "Quais são os seus alimentos favoritos?",
    favoriteFoodsPlaceholder: "Liste os seus alimentos preferidos (ex: frango, brócolos, aveia...)",
    cookingSkill: "Como avalia a sua habilidade culinária?",
    beginner: "Iniciante",
    intermediate: "Intermediário",
    advanced: "Avançado",
    allergies: "Tem alguma alergia alimentar?",
    allergiesPlaceholder: "Liste todas as suas alergias conhecidas...",
    intolerances: "Tem alguma intolerância alimentar?",
    intolerancesPlaceholder: "Ex: lactose, glúten...",
    dislikedFoods: "Alimentos que não gosta ou não pode comer?",
    dislikedFoodsPlaceholder: "Liste todos os alimentos que devem ser evitados...",
     currentBreakfast: "O que você costuma comer no café da manhã?",
    currentBreakfastPlaceholder: "Descreva seu café da manhã típico...",
    currentLunch: "O que come normalmente ao almoço?",
    currentLunchPlaceholder: "Descreva o seu almoço típico...",
    currentDinner: "O que come normalmente ao jantar?",
    currentDinnerPlaceholder: "Descreva o seu jantar típico...",
    waterIntake: "Quanta água bebe por dia (em litros)?",
    waterIntakePlaceholder: "Ex: 2.5",
    finalTitle: "Está tudo pronto!",
    finalMessage: "Revise as suas informações e, quando estiver pronto, clique em 'Enviar Respostas' para que a nossa IA possa criar o seu plano personalizado.",
  },
  en: {
    personalInfo: "Personal Information",
    objectives: "Objectives",
    dailyRoutine: "Daily Routine",
    physicalActivity: "Physical Activity",
    foodPreferences: "Food Preferences",
    restrictions: "Restrictions & Allergies",
    currentEating: "Current Eating Habits",
    summary: "Finish",
    step: "Step",
    of: "of",
    previous: "Previous",
    next: "Next",
    submit: "Submit Answers",
    loading: "Submitting...",
    quizSubmitted: "Quiz Submitted!",
    successMessage: "Thank you! Your first diet plan will be generated shortly.",
    fullName: "Full Name",
    fullNamePlaceholder: "Your full name",
    age: "Age",
    agePlaceholder: "Your age",
    gender: "Gender",
    genderSelect: "Select your gender",
    male: "Male",
    female: "Female",
    other: "Other",
    height: "Height (cm)",
    heightPlaceholder: "e.g., 175",
    currentWeight: "Current Weight (kg)",
    currentWeightPlaceholder: "e.g., 70.5",
    targetWeight: "Target Weight (kg)",
    targetWeightPlaceholder: "e.g., 65",
    mainGoal: "What is your main goal?",
    loseWeight: "Lose weight",
    gainMuscle: "Gain muscle mass",
    maintainWeight: "Maintain weight",
    improveHealth: "Improve health",
    wakeUpTime: "What time do you wake up?",
    sleepTime: "What time do you go to sleep?",
    mealsPerDay: "How many meals do you prefer per day?",
    "3meals": "3 Meals",
    "4meals": "4 Meals",
    "5meals": "5 Meals",
    "6meals": "6+ Meals",
    exerciseRegularly: "Do you exercise regularly?",
    yes: "Yes",
    no: "No",
    sometimes: "Sometimes",
    exerciseType: "What kind of exercise do you usually do? (You can check multiple)",
    weightTraining: "Weight Training",
    cardio: "Cardio (Running, Cycling, etc.)",
    yogaPilates: "Yoga / Pilates",
    sports: "Team Sports",
    vegetarian: "Are you vegetarian?",
    vegan: "Are you vegan?",
    favoriteFoods: "What are your favorite foods?",
    favoriteFoodsPlaceholder: "List your favorite foods (e.g., chicken, broccoli, oats...)",
    cookingSkill: "How do you rate your cooking skills?",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    allergies: "Do you have any food allergies?",
    allergiesPlaceholder: "List all your known allergies...",
    intolerances: "Do you have any food intolerances?",
    intolerancesPlaceholder: "E.g., lactose, gluten...",
    dislikedFoods: "Foods you dislike or cannot eat?",
    dislikedFoodsPlaceholder: "List all foods to be avoided...",
    currentBreakfast: "What do you usually have for breakfast?",
    currentBreakfastPlaceholder: "Describe your typical breakfast...",
    currentLunch: "What do you usually have for lunch?",
    currentLunchPlaceholder: "Describe your typical lunch...",
    currentDinner: "What do you usually have for dinner?",
    currentDinnerPlaceholder: "Describe your typical dinner...",
    waterIntake: "How much water do you drink per day (in liters)?",
    waterIntakePlaceholder: "e.g., 2.5",
    finalTitle: "All set!",
    finalMessage: "Review your information and, when ready, click 'Submit Answers' so our AI can create your personalized plan.",
  }
};

const Sidebar = ({ t, currentStep }) => {
  const menuItems = [
    { label: t.personalInfo, icon: User, step: 1 },
    { label: t.objectives, icon: Target, step: 2 },
    { label: t.dailyRoutine, icon: Activity, step: 3 },
    { label: t.physicalActivity, icon: Apple, step: 4 },
    { label: t.foodPreferences, icon: LifeBuoy, step: 5 },
    { label: t.restrictions, icon: ShieldAlert, step: 6 },
    { label: t.currentEating, icon: Utensils, step: 7 },
    { label: t.summary, icon: CheckIcon, step: 8 },
  ];

  return (
    <aside className="w-full lg:w-72 bg-card text-card-foreground p-6 rounded-xl border">
      <h2 className="text-xl font-semibold mb-4">📋 Menu</h2>
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li key={item.step}>
            <a href="#" className={cn(
              "flex items-center gap-3 p-3 rounded-md transition-colors text-sm font-medium",
              currentStep === item.step
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted/50"
            )}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

// --- Componentes da UI ---
const buttonVariants=cva("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground"},size:{default:"h-10 px-4 py-2",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}});const Button=React.forwardRef(({className,variant,size,asChild=false,...props},ref)=>{const Comp=asChild?Slot:"button";return<Comp className={cn(buttonVariants({variant,size,className}))}ref={ref}{...props}/>});Button.displayName="Button";
const Input=React.forwardRef(({className,type,...props},ref)=>{return<input type={type}className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",className)}ref={ref}{...props}/>});Input.displayName="Input";
const Label=React.forwardRef(({className,...props},ref)=>(<LabelPrimitive.Root ref={ref}className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",className)}{...props}/>));Label.displayName=LabelPrimitive.Root.displayName;
const Select=SelectPrimitive.Root;const SelectValue=SelectPrimitive.Value;const SelectTrigger=React.forwardRef(({className,children,...props},ref)=>(<SelectPrimitive.Trigger ref={ref}className={cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",className)}{...props}>{children}<SelectPrimitive.Icon asChild><ChevronDownIcon className="h-4 w-4 opacity-50"/></SelectPrimitive.Icon></SelectPrimitive.Trigger>));SelectTrigger.displayName=SelectPrimitive.Trigger.displayName;const SelectContent=React.forwardRef(({className,children,position="popper",...props},ref)=>(<SelectPrimitive.Portal><SelectPrimitive.Content ref={ref}className={cn("relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",position==="popper"&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",className)}position={position}{...props}><SelectPrimitive.Viewport className={cn("p-1",position==="popper"&&"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]")}>{children}</SelectPrimitive.Viewport></SelectPrimitive.Content></SelectPrimitive.Portal>));SelectContent.displayName=SelectPrimitive.Content.displayName;const SelectItem=React.forwardRef(({className,children,...props},ref)=>(<SelectPrimitive.Item ref={ref}className={cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",className)}{...props}><span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"><SelectPrimitive.ItemIndicator><CheckIcon className="h-4 w-4"/></SelectPrimitive.ItemIndicator></span><SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText></SelectPrimitive.Item>));SelectItem.displayName=SelectPrimitive.Item.displayName;
const RadioGroup=React.forwardRef(({className,...props},ref)=>{return(<RadioGroupPrimitive.Root className={cn("grid gap-2",className)}{...props}ref={ref}/>)});RadioGroup.displayName=RadioGroupPrimitive.Root.displayName;const RadioGroupItem=React.forwardRef(({className,...props},ref)=>{return(<RadioGroupPrimitive.Item ref={ref}className={cn("aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",className)}{...props}><RadioGroupPrimitive.Indicator className="flex items-center justify-center"><CircleIcon className="h-2.5 w-2.5 fill-current text-current"/></RadioGroupPrimitive.Indicator></RadioGroupPrimitive.Item>)});RadioGroupItem.displayName=RadioGroupPrimitive.Item.displayName;
const Progress=React.forwardRef(({className,value,...props},ref)=>(<ProgressPrimitive.Root ref={ref}className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary",className)}{...props}><ProgressPrimitive.Indicator className="h-full w-full flex-1 bg-primary transition-all"style={{transform:`translateX(-${100-(value||0)}%)`}}/></ProgressPrimitive.Root>));Progress.displayName=ProgressPrimitive.Root.displayName;const Separator=React.forwardRef(({className,orientation='horizontal',decorative=true,...props},ref)=>(<SeparatorPrimitive.Root ref={ref}decorative={decorative}orientation={orientation}className={cn('shrink-0 bg-border',orientation==='horizontal'?'h-[1px] w-full':'h-full w-[1px]',className)}{...props}/>));Separator.displayName=SeparatorPrimitive.Root.displayName;
const Checkbox=React.forwardRef(({className,...props},ref)=>(<CheckboxPrimitive.Root ref={ref}className={cn("peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",className)}{...props}><CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}><CheckIcon className="h-4 w-4"/></CheckboxPrimitive.Indicator></CheckboxPrimitive.Root>));Checkbox.displayName=CheckboxPrimitive.Root.displayName;
const Textarea = React.forwardRef(({ className, ...props }, ref) => { return (<textarea className={cn("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)} ref={ref} {...props} />); }); Textarea.displayName = "Textarea";

// --- Fim dos Componentes Embutidos ---

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [language, setLanguage] = useState('pt');
  const [darkMode, setDarkMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

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

  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
        const response = await fetch('http://localhost:5000/api/ai/test-generation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quizData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Resposta do Backend:", result);
        setIsSubmitted(true);

    } catch (error) {
        console.error("Erro ao enviar o quiz:", error);
        // Opcional: mostrar uma mensagem de erro ao utilizador
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
        <div className="text-center flex flex-col items-center justify-center min-h-[300px]">
            <CheckIcon className="h-16 w-16 text-green-500 bg-green-100 dark:bg-green-900/50 rounded-full p-3 mb-4" />
            <h3 className="text-2xl font-semibold text-green-600 dark:text-green-400">{t.quizSubmitted}</h3>
            <p className="mt-2 text-lg text-muted-foreground">{t.successMessage}</p>
        </div>
      );
    }

    switch(currentStep) {
      case 1: return( <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"><div className="space-y-1.5"><Label htmlFor="fullName">{t.fullName}</Label><Input id="fullName" placeholder={t.fullNamePlaceholder} value={quizData.fullName} onChange={handleInputChange}/></div><div className="space-y-1.5"><Label htmlFor="age">{t.age}</Label><Input id="age" type="number" placeholder={t.agePlaceholder} value={quizData.age} onChange={handleInputChange}/></div><div className="space-y-1.5"><Label htmlFor="gender">{t.gender}</Label><Select onValueChange={(v)=>handleValueChange('gender',v)}value={quizData.gender}><SelectTrigger><SelectValue placeholder={t.genderSelect}/></SelectTrigger><SelectContent><SelectItem value="male">{t.male}</SelectItem><SelectItem value="female">{t.female}</SelectItem><SelectItem value="other">{t.other}</SelectItem></SelectContent></Select></div><div className="space-y-1.5"><Label htmlFor="height">{t.height}</Label><Input id="height" type="number" placeholder={t.heightPlaceholder} value={quizData.height} onChange={handleInputChange}/></div><div className="space-y-1.5"><Label htmlFor="currentWeight">{t.currentWeight}</Label><Input id="currentWeight" type="number" placeholder={t.currentWeightPlaceholder} value={quizData.currentWeight} onChange={handleInputChange}/></div><div className="space-y-1.5"><Label htmlFor="targetWeight">{t.targetWeight}</Label><Input id="targetWeight" type="number" placeholder={t.targetWeightPlaceholder} value={quizData.targetWeight} onChange={handleInputChange}/></div></div>);
      case 2: return( <div><Label className="text-base font-semibold">{t.mainGoal}</Label><RadioGroup className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" value={quizData.mainGoal} onValueChange={(v)=>handleValueChange('mainGoal',v)}>{[t.loseWeight,t.gainMuscle,t.maintainWeight,t.improveHealth].map(g=>(<div key={g}><RadioGroupItem value={g}id={g}className="peer sr-only"/><Label htmlFor={g}className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">{g}</Label></div>))}</RadioGroup></div>);
      case 3: return( <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"><div className="space-y-1.5"><Label htmlFor="wakeUpTime">{t.wakeUpTime}</Label><Input id="wakeUpTime" type="time" value={quizData.wakeUpTime} onChange={handleInputChange}/></div><div className="space-y-1.5"><Label htmlFor="sleepTime">{t.sleepTime}</Label><Input id="sleepTime" type="time" value={quizData.sleepTime} onChange={handleInputChange}/></div><div className="md:col-span-2 space-y-2"><Label>{t.mealsPerDay}</Label><RadioGroup className="flex flex-wrap gap-4" value={quizData.mealsPerDay} onValueChange={(v)=>handleValueChange('mealsPerDay',v)}><div className="flex items-center space-x-2"><RadioGroupItem value="3" id="3meals"/><Label htmlFor="3meals">{t['3meals']}</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="4" id="4meals"/><Label htmlFor="4meals">{t['4meals']}</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="5" id="5meals"/><Label htmlFor="5meals">{t['5meals']}</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="6+" id="6meals"/><Label htmlFor="6meals">{t['6meals']}</Label></div></RadioGroup></div></div>);
      case 4: return( <div className="space-y-6"><div className="space-y-2"><Label>{t.exerciseRegularly}</Label><RadioGroup className="flex flex-wrap gap-4" value={quizData.exerciseRegularly} onValueChange={(v)=>handleValueChange('exerciseRegularly',v)}><div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="ex-yes"/><Label htmlFor="ex-yes">{t.yes}</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="no" id="ex-no"/><Label htmlFor="ex-no">{t.no}</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="sometimes" id="ex-sometimes"/><Label htmlFor="ex-sometimes">{t.sometimes}</Label></div></RadioGroup></div><div className="space-y-2"><Label>{t.exerciseType}</Label><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Object.keys(quizData.exerciseType).map(key=>(<div key={key}className="flex items-center space-x-2"><Checkbox id={key}checked={quizData.exerciseType[key]}onCheckedChange={()=>handleCheckboxChange('exerciseType',key)}/><Label htmlFor={key}className="font-normal">{t[key]}</Label></div>))}</div></div></div>);
      case 5: return( <div className="space-y-6"><div className="space-y-2"><Label>{t.vegetarian}</Label><RadioGroup className="flex gap-4" value={quizData.vegetarian} onValueChange={(v)=>handleValueChange('vegetarian',v)}><div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="veg-yes"/><Label htmlFor="veg-yes">{t.yes}</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="no" id="veg-no"/><Label htmlFor="veg-no">{t.no}</Label></div></RadioGroup></div><div className="space-y-2"><Label>{t.vegan}</Label><RadioGroup className="flex gap-4" value={quizData.vegan} onValueChange={(v)=>handleValueChange('vegan',v)}><div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="vegan-yes"/><Label htmlFor="vegan-yes">{t.yes}</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="no" id="vegan-no"/><Label htmlFor="vegan-no">{t.no}</Label></div></RadioGroup></div><div className="space-y-1.5"><Label htmlFor="favoriteFoods">{t.favoriteFoods}</Label><Textarea id="favoriteFoods" placeholder={t.favoriteFoodsPlaceholder} value={quizData.favoriteFoods} onChange={handleInputChange}/></div><div className="space-y-2"><Label>{t.cookingSkill}</Label><RadioGroup className="flex flex-wrap gap-4" value={quizData.cookingSkill} onValueChange={(v)=>handleValueChange('cookingSkill',v)}><div className="flex items-center space-x-2"><RadioGroupItem value="beginner" id="skill-beginner"/><Label htmlFor="skill-beginner">{t.beginner}</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="intermediate" id="skill-intermediate"/><Label htmlFor="skill-intermediate">{t.intermediate}</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="advanced" id="skill-advanced"/><Label htmlFor="skill-advanced">{t.advanced}</Label></div></RadioGroup></div></div>);
      case 6: return( <div className="space-y-4"><div className="space-y-1.5"><Label htmlFor="allergies">{t.allergies}</Label><Textarea id="allergies" placeholder={t.allergiesPlaceholder} value={quizData.allergies} onChange={handleInputChange}/></div><div className="space-y-1.5"><Label htmlFor="intolerances">{t.intolerances}</Label><Textarea id="intolerances" placeholder={t.intolerancesPlaceholder} value={quizData.intolerances} onChange={handleInputChange}/></div><div className="space-y-1.5"><Label htmlFor="dislikedFoods">{t.dislikedFoods}</Label><Textarea id="dislikedFoods" placeholder={t.dislikedFoodsPlaceholder} value={quizData.dislikedFoods} onChange={handleInputChange}/></div></div>);
      case 7: return( <div className="space-y-4"><div className="space-y-1.5"><Label htmlFor="currentBreakfast">{t.currentBreakfast}</Label><Textarea id="currentBreakfast" placeholder={t.currentBreakfastPlaceholder} value={quizData.currentBreakfast} onChange={handleInputChange}/></div><div className="space-y-1.5"><Label htmlFor="currentLunch">{t.currentLunch}</Label><Textarea id="currentLunch" placeholder={t.currentLunchPlaceholder} value={quizData.currentLunch} onChange={handleInputChange}/></div><div className="space-y-1.5"><Label htmlFor="currentDinner">{t.currentDinner}</Label><Textarea id="currentDinner" placeholder={t.currentDinnerPlaceholder} value={quizData.currentDinner} onChange={handleInputChange}/></div><div className="space-y-1.5"><Label htmlFor="waterIntake">{t.waterIntake}</Label><Input id="waterIntake" type="number" placeholder={t.waterIntakePlaceholder} value={quizData.waterIntake} onChange={handleInputChange}/></div></div>);
      case 8: return( <div className="text-center"><h3 className="text-2xl font-semibold">{t.finalTitle}</h3><p className="mt-2 text-muted-foreground">{t.finalMessage}</p></div>);
      default: return <p className="text-center py-10 text-muted-foreground">Etapa {currentStep} em construção...</p>;
    }
  };

  return (
    <div className={cn("min-h-screen font-sans antialiased", darkMode ? "dark" : "")}>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-8"><h1 className="text-3xl font-bold tracking-tight">DietIA</h1><div className='flex items-center gap-2'><Select onValueChange={setLanguage} value={language}><SelectTrigger className="w-auto"><SelectValue>{language==='pt'?'🇧🇷 Português':'🇺🇸 English'}</SelectValue></SelectTrigger><SelectContent><SelectItem value="pt">🇧🇷 Português</SelectItem><SelectItem value="en">🇺🇸 English</SelectItem></SelectContent></Select><Button variant="outline" size="icon" onClick={()=>setDarkMode(!darkMode)}>{darkMode?<Sun className="h-[1.2rem] w-[1.2rem]"/>:<Moon className="h-[1.2rem] w-[1.2rem]"/>}</Button></div></header>
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar t={t} currentStep={currentStep}/>
          <main className="flex-1">
             <div className="p-6 sm:p-8 bg-card text-card-foreground rounded-xl border">
                {!isSubmitted && <div className="pb-6"><div className="flex items-center space-x-4"><div className="p-3 bg-primary/10 rounded-full">{(()=>{const Icon=getStepIcon(currentStep);return<Icon className="h-6 w-6 text-primary"/>})()}</div><div><h2 className="text-2xl font-semibold">{getStepTitle(currentStep)}</h2><p className="text-sm text-muted-foreground">{t.step} {currentStep} {t.of} {totalSteps}</p></div></div><Progress value={progress} className="mt-4"/></div>}
                {!isSubmitted && <Separator/>}
                <div className="py-8 min-h-[300px]">{renderCurrentStep()}</div>
                {!isSubmitted && <><Separator/><div className="flex justify-between items-center pt-6">
                  <Button variant="outline" onClick={prevStep} disabled={currentStep===1}>{t.previous}</Button>
                  {currentStep === totalSteps ? (<Button onClick={submitQuiz} disabled={isSubmitting}>{isSubmitting ? t.loading : t.submit}</Button>) : (<Button onClick={nextStep}>{t.next}</Button>)}
                </div></>}
             </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;

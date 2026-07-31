export interface UseCase {
  id: string;
  title: string;
  category: string;
  context: string;
  problem: string;
  solution: string;
  emotionalResult: string;
  howItWorks: string;
  recipientExperience: string;
  benefit: string;
  callToAction: string;
  exampleLetter: string;
  examplePhotos: string;
  exampleVideoType: string;
  socialMedia: {
    instagram: string;
    tiktok: string;
    facebook: string;
    whatsapp: string;
    reelScript: string;
    metaAdsCopy: string;
    hook: string;
  };
}

export interface ProductKnowledge {
  lastUpdated: string;
  product: {
    summary: string;
    problemSolved: string;
    whatCustomerReceives: string;
    howItWorks: string;
    differentiator: string;
    emotionalGoal: string;
    valueProposition: string;
    whatItIsNot: string;
  };
  branding: {
    category: string[];
    suggestedNames: string[];
    noteToAI: string;
  };
  audiences: {
    target: string[];
    motivations: string[];
  };
  experienceStructure: {
    sections: { name: string; description: string }[];
    currentOrder: string[];
  };
  relationships: {
    types: string[];
    impact: string;
  };
  occasions: {
    types: string[];
    impact: string;
  };
  emotionalTones: Array<{
    name: string;
    goal: string;
    recommendedWords: string[];
    avoidWords: string[];
    style: string;
    titleIdeas: string[];
    callToActionIdeas: string[];
    suggestedColors: string;
    socialMediaStyle: string;
    suggestedMusic: string;
    suggestedVideoEditing: string;
  }>;
  visualThemes: Array<{
    id: string;
    name: string;
    description: string;
    dynamicElements: string[];
  }>;
  galleryBehavior: {
    features: string[];
    socialMediaRepresentation: string;
  };
  videoFeature: {
    maxDuration: string;
    format: string;
    location: string;
    playback: string;
    mobileBehavior: string;
    limitations: string;
    compression: string;
  };
  photosFeature: {
    maxQuantity: number;
    recommendedSize: string;
    formats: string[];
    features: string[];
  };
  socialMediaVideoGeneration: {
    description: string;
    differences: {
      originalVideo: string;
      fullExperienceVideo: string;
    };
    techSpecs: string[];
  };
  commercialPlans: Array<{
    name: string;
    referencePriceCLP: number;
    includes: string[];
  }>;
  renewals: {
    model: string[];
    plans: string[];
  };
  mariachiIntegration: {
    description: string;
    saleFormats: string[];
    experienceFlow: string[];
    referencePrices: string[];
  };
  operationalFlow: string[];
  adminPanel: {
    structure: string[];
    model: string;
  };
  technicalArchitecture: {
    implemented: string[];
    planned: string[];
  };
  infrastructure: {
    current: string[];
    recommendations: string[];
  };
  faq: Array<{ question: string; answer: string }>;
  commercialMessages: Array<{ type: string; content: string }>;
  brandVoice: {
    traits: string[];
    avoidTraits: string[];
    avoidPhrases: string[];
  };
  aiGuidelines: string[];
  implementationStatus: Array<{
    feature: string;
    status: 'Implementada' | 'Parcial' | 'Pendiente' | 'Error';
    priority: string;
    relatedFiles: string;
  }>;
  useCases: UseCase[];
}

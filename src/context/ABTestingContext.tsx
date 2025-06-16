
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types for experiments and variants
export type ExperimentVariant = 'A' | 'B';
export type ExperimentName = string;

interface ExperimentConfig {
  name: ExperimentName;
  variants: ExperimentVariant[];
  weights?: number[]; // Optional weights for variants (must sum to 1)
}

interface ABTestingState {
  userId: string;
  assignments: Record<ExperimentName, ExperimentVariant>;
}

interface ABTestingContextValue {
  // Core functions
  assignVariant: (experimentName: ExperimentName) => ExperimentVariant;
  getVariant: (experimentName: ExperimentName) => ExperimentVariant | null;
  isVariant: (experimentName: ExperimentName, variant: ExperimentVariant) => boolean;
  
  // Configuration and tracking
  userId: string;
  experiments: ExperimentConfig[];
  registerExperiment: (experiment: ExperimentConfig) => void;
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
}

const ABTestingContext = createContext<ABTestingContextValue | undefined>(undefined);

// Storage key for AB testing state
const AB_TESTING_STORAGE_KEY = 'statusnow_ab_testing';

// Get or create a user ID for consistent assignment
const getUserId = (): string => {
  const storedState = localStorage.getItem(AB_TESTING_STORAGE_KEY);
  
  if (storedState) {
    try {
      const parsedState = JSON.parse(storedState);
      return parsedState.userId;
    } catch (e) {
      console.error('Error parsing AB testing state', e);
    }
  }
  
  return uuidv4();
};

export const ABTestingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with stored values or defaults
  const [state, setState] = useState<ABTestingState>(() => {
    const storedState = localStorage.getItem(AB_TESTING_STORAGE_KEY);
    
    if (storedState) {
      try {
        return JSON.parse(storedState);
      } catch (e) {
        console.error('Error parsing AB testing state', e);
      }
    }
    
    return {
      userId: getUserId(),
      assignments: {}
    };
  });
  
  const [experiments, setExperiments] = useState<ExperimentConfig[]>([]);
  
  // Persist state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(AB_TESTING_STORAGE_KEY, JSON.stringify(state));
  }, [state]);
  
  // Assign a variant using consistent hashing by default
  const assignVariant = (experimentName: ExperimentName): ExperimentVariant => {
    // Check if already assigned
    if (state.assignments[experimentName]) {
      return state.assignments[experimentName];
    }
    
    // Find experiment config
    const experiment = experiments.find(exp => exp.name === experimentName);
    
    if (!experiment) {
      console.warn(`Experiment "${experimentName}" not registered. Defaulting to variant A.`);
      return 'A';
    }
    
    // Determine variant based on weights or hash
    let variant: ExperimentVariant;
    
    if (experiment.weights && experiment.weights.length === experiment.variants.length) {
      // Weighted random assignment
      const random = Math.random();
      let cumulativeWeight = 0;
      
      for (let i = 0; i < experiment.weights.length; i++) {
        cumulativeWeight += experiment.weights[i];
        if (random <= cumulativeWeight) {
          variant = experiment.variants[i];
          break;
        }
      }
      
      // Fallback in case of rounding errors
      variant = variant || experiment.variants[0];
    } else {
      // Consistent hash-based assignment
      const hash = hashCode(`${state.userId}-${experimentName}`);
      const variantIndex = Math.abs(hash) % experiment.variants.length;
      variant = experiment.variants[variantIndex];
    }
    
    // Store the assignment
    setState(prevState => ({
      ...prevState,
      assignments: {
        ...prevState.assignments,
        [experimentName]: variant
      }
    }));
    
    // Track experiment assignment
    trackEvent('experiment_assigned', {
      experiment: experimentName,
      variant,
      userId: state.userId
    });
    
    return variant;
  };
  
  const getVariant = (experimentName: ExperimentName): ExperimentVariant | null => {
    // Return the variant if already assigned, or null
    return state.assignments[experimentName] || null;
  };
  
  const isVariant = (experimentName: ExperimentName, variant: ExperimentVariant): boolean => {
    // Check if the user is in the specified variant
    const assignedVariant = getVariant(experimentName);
    return assignedVariant === variant;
  };
  
  const registerExperiment = (experiment: ExperimentConfig) => {
    setExperiments(prev => {
      // Check if experiment already exists
      const exists = prev.some(exp => exp.name === experiment.name);
      if (exists) return prev;
      return [...prev, experiment];
    });
  };
  
  const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
    // Simple console logging for now - can be extended to analytics services
    console.log('AB Testing Event:', eventName, {
      ...properties,
      userId: state.userId,
      timestamp: new Date().toISOString(),
    });
    
    // Here you would normally send this to your analytics service
    // Example: analytics.track(eventName, { ...properties, userId: state.userId });
  };
  
  const value = {
    userId: state.userId,
    assignVariant,
    getVariant,
    isVariant,
    experiments,
    registerExperiment,
    trackEvent
  };
  
  return (
    <ABTestingContext.Provider value={value}>
      {children}
    </ABTestingContext.Provider>
  );
};

// Simple string hash function
function hashCode(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return hash;
}

export const useABTesting = () => {
  const context = useContext(ABTestingContext);
  if (context === undefined) {
    throw new Error('useABTesting must be used within an ABTestingProvider');
  }
  return context;
};

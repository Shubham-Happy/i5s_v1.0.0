
import { useEffect } from 'react';
import { useABTesting, ExperimentName, ExperimentVariant } from '@/context/ABTestingContext';

/**
 * Hook for using AB test experiments in components
 * @param experimentName The name of the experiment
 * @param options Additional experiment configuration
 * @returns The assigned variant for this user
 */
export function useExperiment(
  experimentName: ExperimentName, 
  options: {
    variants?: ExperimentVariant[],
    weights?: number[],
    defaultVariant?: ExperimentVariant,
    onExposure?: (variant: ExperimentVariant) => void
  } = {}
) {
  const { 
    assignVariant, 
    getVariant, 
    isVariant, 
    registerExperiment, 
    trackEvent 
  } = useABTesting();
  
  const {
    variants = ['A', 'B'],
    weights,
    defaultVariant = 'A',
    onExposure
  } = options;
  
  // Register the experiment if needed
  useEffect(() => {
    registerExperiment({
      name: experimentName,
      variants,
      weights
    });
  }, [experimentName, JSON.stringify(variants), JSON.stringify(weights)]);
  
  // Get or assign variant
  const existingVariant = getVariant(experimentName);
  const variant = existingVariant || assignVariant(experimentName);
  
  // Track exposure to the experiment
  useEffect(() => {
    if (variant) {
      // Track that this user was exposed to this experiment variant
      trackEvent('experiment_exposure', {
        experiment: experimentName,
        variant
      });
      
      // Execute custom exposure callback if provided
      if (onExposure) {
        onExposure(variant);
      }
    }
  }, [experimentName, variant]);
  
  return {
    // The variant this user is assigned to
    variant,
    
    // Helper to check if user is in a specific variant
    isVariant: (checkVariant: ExperimentVariant) => isVariant(experimentName, checkVariant),
    
    // Helper to conditionally render based on variant
    renderVariant: <T>(
      variantA: T, 
      variantB: T,
      otherVariants?: Record<ExperimentVariant, T>
    ): T => {
      if (variant === 'A') return variantA;
      if (variant === 'B') return variantB;
      if (otherVariants && otherVariants[variant]) return otherVariants[variant];
      return variantA; // Default to A as fallback
    },
    
    // Track a conversion or other event related to this experiment
    trackConversion: (eventName: string, properties: Record<string, any> = {}) => {
      trackEvent(eventName, {
        ...properties,
        experiment: experimentName,
        variant
      });
    }
  };
}

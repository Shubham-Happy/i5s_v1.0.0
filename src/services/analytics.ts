
type EventName = string;
type EventProperties = Record<string, any>;

/**
 * Analytics service for tracking user behavior and A/B testing results
 * This is a simple implementation that could be expanded to use actual analytics services
 */
class AnalyticsService {
  private static instance: AnalyticsService;
  private initialized: boolean = false;
  private userId: string | null = null;
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }
  
  /**
   * Initialize the analytics service
   */
  public init(userId: string): void {
    if (this.initialized) return;
    
    this.userId = userId;
    this.initialized = true;
    
    // Track initial session data
    this.trackEvent('session_start', {
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`
    });
    
    console.log('Analytics service initialized with user ID:', userId);
  }
  
  /**
   * Track an event with optional properties
   */
  public trackEvent(eventName: EventName, properties: EventProperties = {}): void {
    if (!this.initialized) {
      console.warn('Analytics service not initialized. Call init() first');
      return;
    }
    
    const eventData = {
      ...properties,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      path: window.location.pathname
    };
    
    // Log to console for development
    console.log(`[Analytics] ${eventName}:`, eventData);
    
    // Here you would normally send this to your analytics provider
    // Example: 
    // - Google Analytics: gtag('event', eventName, eventData)
    // - Mixpanel: mixpanel.track(eventName, eventData)
    // - Segment: analytics.track(eventName, eventData)
  }
  
  /**
   * Track experiment exposure
   */
  public trackExperiment(experimentName: string, variant: string): void {
    this.trackEvent('experiment_exposure', { experiment: experimentName, variant });
  }
  
  /**
   * Track experiment conversion
   */
  public trackConversion(experimentName: string, variant: string, conversionName: string, value?: number): void {
    this.trackEvent('experiment_conversion', { 
      experiment: experimentName, 
      variant,
      conversionName,
      conversionValue: value
    });
  }
}

// Export a singleton instance
export const analytics = AnalyticsService.getInstance();

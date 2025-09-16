// ===== UNIFIED CONSTANTS - SINGLE SOURCE OF TRUTH =====
// All hardcoded values centralized here

export const FINANCIAL_CONSTANTS = {
    // Conversion factors
    PERCENTAGE_DIVISOR: 100,
    BPS_DIVISOR: 10_000,
    WEI_DIVISOR: 1e18,

    // Price conversions
    PRICE_TO_PERCENTAGE: 100,
    AGGREGATION_MIN_FACTOR: 100,
    AGGREGATION_DIVISOR: 100,

    // Points system
    POINTS_K_THRESHOLD: 1000,
    POINTS_M_THRESHOLD: 1_000_000,
    POINTS_K_DIVISOR: 100,
    POINTS_M_DIVISOR: 100_000,
    POINTS_DECIMAL_PLACES: 10,

    // Time conversions
    MILLISECONDS_TO_SECONDS: 1000,

    // Math safety
    MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,

    // Default values
    DEFAULT_DECIMALS: 2,
    DEFAULT_MIN_DECIMALS: 0,
    DEFAULT_MAX_DECIMALS: 4,
    DEFAULT_ONE_DECIMALS: 1,

    // Precision
    CALCULATION_PRECISION: 1_000_000,

    // Order limits
    MAX_OPEN_ORDERS: 20,

    // Time periods
    REDEMPTION_GRACE_PERIOD_DAYS: 7,
    ZERO: 0,
} as const;

export const UI_CONSTANTS = {
    // Header dimensions
    MIN_WIDTH_LAPTOP: '100px',

    // Default display formats
    DEFAULT_LOCALE: 'en-US',
    DEFAULT_CURRENCY: 'USD',
} as const;

export const DISPLAY_CONSTANTS = {
    // Default empty values
    EMPTY_PRICE_DISPLAY: '--.--',
    EMPTY_RATE_DISPLAY: '--.--%',
} as const;

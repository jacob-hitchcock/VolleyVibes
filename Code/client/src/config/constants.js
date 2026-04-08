/**
 * Centralized design and configuration constants for VolleyVibes.
 *
 * Import from this file instead of hardcoding values inline.
 * Example: import { COLORS, FONTS } from '../config/constants';
 */

/** Brand color palette */
export const COLORS = {
    /** Primary brand orange — used for accents, highlights, active states */
    primary: '#e7552b',
    /** Warm cream — primary background color */
    background: '#fff5d6',
    /** Off-white — used for card surfaces and secondary backgrounds */
    surface: '#ffffff',
    /** Dark text */
    textPrimary: '#1a1a1a',
    /** Muted secondary text */
    textSecondary: '#666666',
    /** Win indicator green */
    win: '#4caf50',
    /** Loss indicator red */
    loss: '#f44336',
};

/** Font family names — match the custom font declarations in index.css */
export const FONTS = {
    /** Display font — used for headings and player names */
    display: 'coolvetica',
    /** Secondary display font — used for decorative headings */
    displayAlt: 'mahoda_display',
    /** System sans-serif fallback */
    body: 'Inter, system-ui, sans-serif',
};

/**
 * Minimum number of games a player must have played to qualify
 * for teammate percentage statistics (avoids small-sample noise).
 */
export const MIN_GAMES_THRESHOLD = 7;

/**
 * The maximum score in a standard volleyball game.
 * Used by the prediction engine when estimating score margins.
 */
export const VOLLEYBALL_MAX_SCORE = 21;

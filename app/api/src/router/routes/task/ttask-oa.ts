import { Int, Path, Query, Str } from '@cloudflare/itty-router-openapi';
import { z } from 'zod';
export const Formats = ['standard', 'startup', 'eternal'] as const;

export const TournamentTypes = [
  'GNK / seasonal',
  'asynchronous tournament',
  'circuit breaker',
  'circuit opener',
  'community tournament',
  'continental championship',
  'infinite recursion',
  'intercontinental championship',
  'national championship',
  'online event',
  'store championship',
  'team tournament',
  'worlds championship',
  'regional championship',
] as const;

export const TournamentTypeComponent = z.enum(TournamentTypes).openapi('TournamentType');
export const FormatComponent = z.enum(Formats).openapi('Format');

export const TournamentConfigComponent = z
  .object({
    code: TournamentTypeComponent,
    tournament_limit: z.number(),
    name: z.string(),
    points: z.number(),
  })
  .openapi('TournamentConfig');
export type TournamentConfigType = z.infer<typeof TournamentConfigComponent>;
export const ResultComponent = z
  .object({
    rank_swiss: z.number(),
    rank_cut: z.number().nullable().optional(),
    season_id: z.number().nullable(),
    points_earned: z.number(),
    tournament_id: z.number(),
    tournament_name: z.string(),
    tournament_type: TournamentTypeComponent,
    players_count: z.number(),
    corp_deck_identity_id: z.number(),
    corp_deck_identity_name: z.string().nullable().optional(),
    corp_deck_faction: z.string().nullable().optional(),
    corp_deck_url: z.string().nullable().optional(),
    runner_deck_identity_id: z.number(),
    runner_deck_identity_name: z.string().nullable().optional(),
    runner_deck_faction: z.string().optional().nullable(),
    runner_deck_url: z.string().nullable().optional(),
    user_id: z.number(),
    user_name: z.string(),
    format: FormatComponent,
    count_for_tournament_type: z.number().default(0),
    is_valid: z.boolean(),
  })
  .openapi('Result');
export type ResultComponentType = z.infer<typeof ResultComponent>;

export const UserResultsResponseComponent = z
  .object({
    user_name: z.string(),
    user_id: z.number(),
    rank: z.number(),
    seasonId: z.number().optional(),
    seasonName: z.string().optional(),
    format: FormatComponent.optional(),
    factionCode: z.string().optional(),
    results: z.array(ResultComponent),
  })
  .openapi('UserResultsResponse');

export const GetUserResultsSchema = {
  tags: ['Results'],
  summary: 'Gets the results for the given user',
  parameters: {
    user: Path(Str, { description: 'Name or ID of the user' }),
    season: Query(z.coerce.number().optional()),
    factionCode: Query(z.string().optional()),
    format: Query(FormatComponent.optional()),
  },
  responses: {
    '200': {
      schema: UserResultsResponseComponent,
      description: 'Gets a list of all results for the given user and supplied filters',
    },
  },
};
export const TournamentComponent = z
  .object({
    id: z.number(),
    name: z.string(),
    date: z.string().datetime().nullable(),
    players_count: z.number(),
    location: z.string(),
    concluded: z.coerce.boolean(),
    format: z.string(),
    type: z.string(),
    season_id: z.number().nullable(),
    season_name: z.string().optional(),
    season_tier: z.string().optional(),
  })
  .openapi('Tournament');
export type TournamentComponentType = z.infer<typeof TournamentComponent>;

export const GetTournamentsSchema = {
  tags: ['Tournament'],
  summary: 'Gets a list of all Tournaments',
  responses: {
    '200': {
      schema: z.array(TournamentComponent),
      description: 'list of Tournaments',
    },
  },
};

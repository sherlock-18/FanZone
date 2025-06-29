import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface Team {
  id: string;
  name: string;
  logo: string;
  sport: string;
  followers: number;
  description: string;
  founded: string;
  league: string;
  isFollowed: boolean;
}

interface TeamState {
  teams: Team[];
  followedTeams: Team[];
  isLoading: boolean;
  error: string | null;
}

type TeamAction =
  | { type: 'FETCH_TEAMS_START' }
  | { type: 'FETCH_TEAMS_SUCCESS'; payload: Team[] }
  | { type: 'FETCH_TEAMS_ERROR'; payload: string }
  | { type: 'FOLLOW_TEAM'; payload: string }
  | { type: 'UNFOLLOW_TEAM'; payload: string };

const TeamContext = createContext<{
  state: TeamState;
  fetchTeams: () => void;
  followTeam: (teamId: string) => void;
  unfollowTeam: (teamId: string) => void;
}>({
  state: { teams: [], followedTeams: [], isLoading: false, error: null },
  fetchTeams: () => {},
  followTeam: () => {},
  unfollowTeam: () => {},
});

const teamReducer = (state: TeamState, action: TeamAction): TeamState => {
  switch (action.type) {
    case 'FETCH_TEAMS_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_TEAMS_SUCCESS':
      return { 
        ...state, 
        teams: action.payload, 
        followedTeams: action.payload.filter(team => team.isFollowed),
        isLoading: false, 
        error: null 
      };
    case 'FETCH_TEAMS_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'FOLLOW_TEAM':
      return {
        ...state,
        teams: state.teams.map(team =>
          team.id === action.payload
            ? { ...team, isFollowed: true, followers: team.followers + 1 }
            : team
        ),
        followedTeams: [
          ...state.followedTeams,
          state.teams.find(team => team.id === action.payload)!
        ].filter(Boolean),
      };
    case 'UNFOLLOW_TEAM':
      return {
        ...state,
        teams: state.teams.map(team =>
          team.id === action.payload
            ? { ...team, isFollowed: false, followers: team.followers - 1 }
            : team
        ),
        followedTeams: state.followedTeams.filter(team => team.id !== action.payload),
      };
    default:
      return state;
  }
};

const mockTeams: Team[] = [
  {
    id: 'manchester-united',
    name: 'Manchester United',
    logo: '🔴',
    sport: 'Football',
    followers: 2500000,
    description: 'One of the most successful clubs in English football history.',
    founded: '1878',
    league: 'Premier League',
    isFollowed: true,
  },
  {
    id: 'barcelona',
    name: 'FC Barcelona',
    logo: '🔵',
    sport: 'Football',
    followers: 3200000,
    description: 'More than a club - Més que un club.',
    founded: '1899',
    league: 'La Liga',
    isFollowed: false,
  },
  {
    id: 'liverpool',
    name: 'Liverpool FC',
    logo: '🔴',
    sport: 'Football',
    followers: 2800000,
    description: 'You\'ll Never Walk Alone.',
    founded: '1892',
    league: 'Premier League',
    isFollowed: true,
  },
  {
    id: 'real-madrid',
    name: 'Real Madrid',
    logo: '⚪',
    sport: 'Football',
    followers: 3500000,
    description: 'The most successful club in Champions League history.',
    founded: '1902',
    league: 'La Liga',
    isFollowed: false,
  },
  {
    id: 'chelsea',
    name: 'Chelsea FC',
    logo: '🔵',
    sport: 'Football',
    followers: 2100000,
    description: 'The Blues from West London.',
    founded: '1905',
    league: 'Premier League',
    isFollowed: false,
  },
  {
    id: 'arsenal',
    name: 'Arsenal FC',
    logo: '🔴',
    sport: 'Football',
    followers: 2300000,
    description: 'The Gunners from North London.',
    founded: '1886',
    league: 'Premier League',
    isFollowed: true,
  },
];

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(teamReducer, {
    teams: [],
    followedTeams: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = () => {
    dispatch({ type: 'FETCH_TEAMS_START' });
    setTimeout(() => {
      dispatch({ type: 'FETCH_TEAMS_SUCCESS', payload: mockTeams });
    }, 1000);
  };

  const followTeam = (teamId: string) => {
    dispatch({ type: 'FOLLOW_TEAM', payload: teamId });
  };

  const unfollowTeam = (teamId: string) => {
    dispatch({ type: 'UNFOLLOW_TEAM', payload: teamId });
  };

  return (
    <TeamContext.Provider
      value={{
        state,
        fetchTeams,
        followTeam,
        unfollowTeam,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
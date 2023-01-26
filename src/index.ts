export type ConvertResult = {
  parseResult?: ParseResult;
  errorsFile: string[];
};

export type Severity = 'info' | 'minor' | 'major' | 'critical' | 'blocker';

export type ParserData = {
  description: string;
  fingerprint: string;
  severity: Severity;
  location: {
    path: string;
    lines: {
      begin: number;
    };
  };
};

export type ParseResult = {
  success: boolean;
  data: ParserData[];
  errors: string[];
};

export type SarifLocation = {
  physicalLocation?: {
    artifactLocation?: {
      uri?: string;
    };
    region?: {
      startLine?: number;
    };
  };
};

export type SarifRunResult = {
  level: 'note' | 'warning' | 'error';
  message?: {
    text?: string;
  };
  locations?: SarifLocation[];
};

export type SarifRun = {
  results: SarifRunResult[];
};

export type SarifObject = {
  runs: SarifRun[];
};

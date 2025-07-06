interface AppConfig {
  expo: {
    extra: {
      youtube: {
        apiKey: string;
        apiUrl: string;
        embedApiKey?: string;
      };
      firebase: {
        apiKey: string;
        authDomain: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
        emulator: boolean;
      };
    };
  };
}

export default AppConfig;

import * as portadillasConfig from "./portadillas.json";
import * as webportadillasConfig from "./webportadillas.json";

export const getConfig = (group: string, page: string) => {
  const configMap: { [key: string]: any } = {
    'digitalplatforms_portadillas': (portadillasConfig as any).default,
    'digitalplatforms_webportadillas': (webportadillasConfig as any).default
  };

  const configKey: string = `${group}_${page}`;
  const config = configMap[configKey];

  if (config) {
    return config;
  } else {
       console.error(`No se encontró configuración para: ${configKey}`);

    return 404;
  }
};

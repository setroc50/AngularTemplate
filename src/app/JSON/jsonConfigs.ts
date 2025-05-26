
import * as portadillasConfig from "./portadillas.json";
import * as webportadillasConfig from "./webportadillas.json";
import * as apiv1PageConfig from "./apiv1Page.json";
import * as apiv1FormConfig from "./apiv1Form.json";

export const getConfig = (group: string, page: string) => {
  const configMap: { [key: string]: any } = {
    'digitalplatforms_portadillas': (portadillasConfig as any).default,
    'digitalplatforms_webportadillas': (webportadillasConfig as any).default,
    'digitalplatforms_apiv1Page': (apiv1PageConfig as any).default,
    'digitalplatforms_apiv1Form': (apiv1FormConfig as any).default
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

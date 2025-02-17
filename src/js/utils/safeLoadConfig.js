import webAppConfig from '../config';

export default function safeLoadConfig (tag) {
  return webAppConfig[tag] || true;
}

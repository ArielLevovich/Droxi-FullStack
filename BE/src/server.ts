import App from './app';
import { RequestController } from './request/request.controller';

const app = new App([new RequestController()]);

app.listen();

import 'dotenv/config';
import express, { Application, NextFunction, Request, Response } from 'express';

import Controller from './interfaces/controller.interface';

class App {
    app: Application = express();
    port = process.env.PORT || 3000;

    constructor(controllers: Controller[]) {
        this.initializeMiddleware();
        this.initHeaderMiddleware();
        this.initializeControllers(controllers);
    }

    private initializeMiddleware(): void {
        this.app.use(express.json());
    }

    private initHeaderMiddleware(): void {
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader(
                'Access-Control-Allow-Headers',
                'Origin , X-Requested-With, Content-Type, Accept, Authorization'
            );
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            next();
        });
        this.app.options('*', (req: Request, res: Response) => {
            res.sendStatus(200);
        });
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    public listen(): void {
        this.app.get('/', (req, res) => res.send('Server is running'));
        this.app.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`);
        });
    }
}

export default App;

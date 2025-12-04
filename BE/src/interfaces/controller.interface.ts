import { Router } from 'express';

interface Controller {
	path: string;
	router: Router;
	// topLevel is a boolean that indicates whether the controller is a top-level controller or should be placed under /api/
	topLevel?: boolean;
}

export default Controller;

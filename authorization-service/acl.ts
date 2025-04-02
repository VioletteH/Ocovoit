interface RoutesConfig {
    [path: string]: {
        [method: string]: {
            [role: string]: boolean;
        };
    };
}

const routesConfig: RoutesConfig = {
    '/': {
        'GET': {
            'USER': true,
            'ADMIN': true
        }
    },
    '/login': {
        'GET': {
            'USER': true,
            'ADMIN': true
        },
        'POST': {
            'USER': true,
            'ADMIN': true
        }
    },
    '/register': {
        'GET': {
            'USER': true,
            'ADMIN': true
        },
        'POST': {
            'USER': true,
            'ADMIN': true
        }
    },
    '/logout': {
        'GET': {
            'USER': true,
            'ADMIN': true
        }
    },
    '/users': {
        'GET': {
            'ADMIN': true,
            'USER': false
        }
    },
};

export default routesConfig;

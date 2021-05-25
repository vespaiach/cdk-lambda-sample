export type EventSource = {
    version: string;
    routeKey: string;
    rawPath: string;
    headers: Record<string, string>;
    queryStringParameters: Record<string, string>;
    rawQueryString: string;
    requestContext: {
        accountId: string;
        apiId: string;
        authentication: {
            clientCert: {
                clientCertPem: string;
                subjectDN: string;
                issuerDN: string;
                serialNumber: string;
                validity: {
                    notBefore: string;
                    notAfter: string;
                };
            };
        };
        authorizer: {
            jwt: {
                claims: {
                    claim1: string;
                    claim2: string;
                };
                scopes: [string, string];
            };
        };
        domainName: string;
        domainPrefix: string;
        http: {
            method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTION' | 'PATCH';
            path: string;
            protocol: 'HTTP/1.1' | 'HTTP/2';
            sourceIp: string;
            userAgent: string;
        };
        requestId: string;
        routeKey: string;
        stage: string;
        time: string;
        timeEpoch: number;
    };
    body: string;
    pathParameters: Record<string, string>;
    isBase64Encoded: boolean;
    stageVariables: Record<string, string>;
};

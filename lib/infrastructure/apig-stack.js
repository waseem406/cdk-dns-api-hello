const cdk = require('@aws-cdk/core');
const apigateway = require("@aws-cdk/aws-apigateway");
const route53 = require('@aws-cdk/aws-route53');
const targets = require('@aws-cdk/aws-route53-targets/lib');

class ApiG_Stack extends cdk.NestedStack {
    /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
    constructor(scope, id, props) {
        super(scope, id, props);

        const restApi = new apigateway.RestApi(this, "demo", {
            restApiName: 'demo',
            endpointTypes: [apigateway.EndpointType.EDGE],
            deploy: false,
        });

        const { hellofx } = this.props
        restApi.root.addMethod('GET', new apigateway.LambdaIntegration(hellofx, {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' }
          }));

        // Handle CORS
        restApi.root.addMethod('OPTIONS', new apigateway.MockIntegration({
            integrationResponses: [{
                statusCode: '200',
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                    'method.response.header.Access-Control-Allow-Origin': "'*'",
                    'method.response.header.Access-Control-Allow-Credentials': "'false'",
                    'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET'",
                },
            }],
            passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
            requestTemplates: {
                "application/json": "{\"statusCode\": 200}"
            }
        }), {
            methodResponses: [{
                statusCode: '200',
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Headers': true,
                    'method.response.header.Access-Control-Allow-Methods': true,
                    'method.response.header.Access-Control-Allow-Credentials': true,
                    'method.response.header.Access-Control-Allow-Origin': true,
                },
            }]
        })

        // * API Deployment and Stage settings

		const deployment = new apigateway.Deployment(this, 'Stage', { api: restApi, retainDeployments: false });
        const stageNameRef = process.env.APIG_STAGE_NAME || 'prod'

		// And different stages
		// const [devStage, testStage, prodStage] = ['dev', 'test', 'prod'].map(item =>
        
		const [prodStage] = [stageNameRef].map(item =>
			new apigateway.Stage(this, `${item}_stage`, {
				deployment, stageName: item, variables: {
				}
			}));
		restApi.deploymentStage = prodStage;

        // ? For custom domain name configuration

		const { zone, domainName, certificate } = props;

        const subdomain = process.env.SUB_DOMAIN || 'api'
		const domain = new apigateway.DomainName(this, "Hello-Domain", {
			domainName: subdomain + '.' + domainName,
			certificate,
			endpointType: apigateway.EndpointType.EDGE,
			securityPolicy: apigateway.SecurityPolicy.TLS_1_2,
		});

		domain.addBasePathMapping(restApi, { stage: prodStage })

		new route53.ARecord(this, "Hello-Record", {
			recordName: subdomain + "." + domainName,
			zone,
			target: route53.RecordTarget.fromAlias(new targets.ApiGatewayDomain(domain))
		});
    }
}

module.exports = { ApiG_Stack }

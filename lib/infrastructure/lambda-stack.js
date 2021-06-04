const cdk = require('@aws-cdk/core');
// const { NodejsFunction } = require("@aws-cdk/aws-lambda-nodejs");
const aws_lambda = require("@aws-cdk/aws-lambda");

class Lambda_Stack extends cdk.NestedStack {
  hellofx;
    /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // const hellofx = new NodejsFunction(this, "helloWorld", {
	// 	functionName: "helloWorld",
	// 	entry: 'src/lambdas/helloFx.js',
	// 	handler: 'handler',
	// 	runtime: aws_lambda.Runtime.NODEJS_14_X,
	// 	environment: {
	// 		MESSAGE_STRING: process.env.MESSAGE_STRING
	// 	},
	// 	bundling: {
	// 		minify: false,
	// 		nodeModules: [
	// 			 // mongodb for mongo connection
	// 		],
	// 		externalModules: [
	// 			'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
	// 		],
	// 	},
	// });
	// defines an AWS Lambda resource
    const hellofx = new aws_lambda.Function(this, 'helloWorld', {
		runtime: aws_lambda.Runtime.NODEJS_14_X,    // execution environment
		code: aws_lambda.Code.fromAsset('src/lambdas'),  // code loaded from "lambda" directory
		handler: 'helloFx.handler'                // file is "hello", function is "handler"
	  });

    this.hellofx = hellofx;
  }
}

module.exports = { Lambda_Stack }

const cdk = require('@aws-cdk/core');
const { DNS_Stack } = require('./infrastructure/domain-stack');
const { ApiG_Stack } = require('./infrastructure/apig-stack');
class DomainManagementStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const { zone, domainName, certificate } = new DNS_Stack(this, 'DNS_Stack');

    new ApiG_Stack(this, "API_Stack", {zone, domainName, certificate})

  }
}

module.exports = { DomainManagementStack }

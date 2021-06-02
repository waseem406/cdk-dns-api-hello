const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const DomainManagement = require('../lib/domain-management-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new DomainManagement.DomainManagementStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});

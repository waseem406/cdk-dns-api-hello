const cdk = require('@aws-cdk/core');
const route53 = require('@aws-cdk/aws-route53');
const acm = require('@aws-cdk/aws-certificatemanager');

class DNS_Stack extends cdk.NestedStack {
  zone
  certificate
  domainName
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const siteDomain = process.env.DOMAIN_NAME
    const subDomain = process.env.SUB_DOMAIN
    let zone;
    if (process.env.CREATE_ROUTE53_HOSTED_ZONE === 'true') {
      zone = new route53.PublicHostedZone(this, 'HelloHZ', {
        zoneName: siteDomain,
        comment: 'This is my HZ'
      })
    } else {
      zone = route53.HostedZone.fromLookup(this, 'Zone', { domainName: siteDomain });
    }
    new cdk.CfnOutput(this, 'SiteDomain', { value: 'https://' + siteDomain });

    // this.certificate = acm.Certificate.fromCertificateArn(this, 'Certificate', process.env.ACM_SSL_ARN);

    const certificate = new acm.DnsValidatedCertificate(this, 'Certificate', {
      domainName: subDomain + '.' + process.env.DOMAIN_NAME,
      subjectAlternativeNames: [process.env.DOMAIN_NAME],
      hostedZone: zone,
      region: 'us-east-1', // ? Mandatory for Cloudfront
    });

    new cdk.CfnOutput(this, 'CertificateARN', { value: certificate.certificateArn });
    if (process.env.CREATE_ROUTE53_HOSTED_ZONE === 'true')
      new cdk.CfnOutput(this, 'ZoneNameServers', { value: zone.hostedZoneNameServers });

    // Export required refs
    this.domainName = siteDomain;
    this.certificate = certificate;
    this.zone = zone
  }
}

module.exports = { DNS_Stack }

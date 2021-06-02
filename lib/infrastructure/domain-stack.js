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
        zone = route53.HostedZone.fromLookup(this, 'Zone', { domainName: siteDomain });
        
        new cdk.CfnOutput(this, 'SiteDomain', { value: 'https://' + siteDomain });

        // this.certificate = acm.Certificate.fromCertificateArn(this, 'Certificate', process.env.ACM_SSL_ARN);

        certificate = new acm.DnsValidatedCertificate(this, 'Certificate', {
            domainName: '*.' +  process.env.DOMAIN_NAME,
            subjectAlternativeNames: [ process.env.DOMAIN_NAME],
            hostedZone: zone,
            region: 'us-east-1', // ? Mandatory for Cloudfront
          });

        new cdk.CfnOutput(this, 'CertificateARN', { value: certificate.certificateArn });

        // Export required refs
        this.domainName = this.domainName;
        this.certificate = this.certificate;
        this.zone = this.zone
  }
}

module.exports = { DNS_Stack }

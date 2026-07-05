{ self }:
{
  config,
  lib,
  pkgs,
  ...
}:

let
  cfg = config.services.zapilates;
  defaultPackage = self.packages.${pkgs.stdenv.hostPlatform.system}.zapilates;
in
{
  options.services.zapilates = {
    enable = lib.mkEnableOption "the zapilates.com static site (served by nginx)";

    package = lib.mkOption {
      type = lib.types.package;
      default = defaultPackage;
      defaultText = lib.literalExpression "zapilates.packages.\${system}.zapilates";
      description = "The built Hugo site to serve.";
    };

    domain = lib.mkOption {
      type = lib.types.str;
      default = "zapilates.com";
      example = "zapilates.com";
      description = "Primary domain to serve the site under.";
    };

    serverAliases = lib.mkOption {
      type = lib.types.listOf lib.types.str;
      default = [ "www.zapilates.com" ];
      example = [ "www.zapilates.com" ];
      description = "Additional server names that should serve the same site.";
    };

    enableACME = lib.mkOption {
      type = lib.types.bool;
      default = true;
      description = ''
        Whether to obtain a Let's Encrypt certificate via ACME.
        When enabled, requires <literal>security.acme.acceptTerms = true</literal>
        and <literal>security.acme.defaults.email</literal> set on the host.
      '';
    };

    forceSSL = lib.mkOption {
      type = lib.types.bool;
      default = true;
      description = "Redirect all plain HTTP requests to HTTPS.";
    };

    openFirewall = lib.mkOption {
      type = lib.types.bool;
      default = true;
      description = "Open ports 80 and 443 in the firewall.";
    };

    extraNginxConfig = lib.mkOption {
      type = lib.types.lines;
      default = "";
      description = "Extra nginx configuration to inject into the vhost block.";
    };
  };

  config = lib.mkIf cfg.enable {
    services.nginx = {
      enable = true;
      recommendedGzipSettings = true;
      recommendedOptimisation = true;
      recommendedProxySettings = true;
      recommendedTlsSettings = true;

      virtualHosts.${cfg.domain} = {
        serverAliases = cfg.serverAliases;
        forceSSL = cfg.forceSSL && cfg.enableACME;
        enableACME = cfg.enableACME;
        root = "${cfg.package}";

        extraConfig = ''
          # Hugo emits pretty URLs — fall through to index.html on directory hits.
          try_files $uri $uri/ $uri/index.html =404;

          # Long-lived caching for hashed assets.
          location ~* \.(?:css|js|woff2?|ttf|otf|eot|ico|png|jpe?g|gif|webp|svg|mp3|mp4)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
          }
        ''
        + cfg.extraNginxConfig;
      };
    };

    networking.firewall = lib.mkIf cfg.openFirewall {
      allowedTCPPorts = [
        80
        443
      ];
    };
  };
}

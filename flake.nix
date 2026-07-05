{
  description = "zapilates.com — Marcelle Volckaert's Pilates studio website (Hugo static site + NixOS module)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
  };

  outputs =
    {
      self,
      nixpkgs,
    }@inputs:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      forAllSystems =
        f:
        nixpkgs.lib.genAttrs supportedSystems (
          system:
          f {
            inherit system;
            pkgs = import nixpkgs {
              inherit system;
              config = {
                allowUnfree = true;
                allowUnfreePredicate =
                  pkg:
                  builtins.elem (nixpkgs.lib.getName pkg) [
                    "bearer"
                  ];
              };
            };
          }
        );
    in
    {
      ######################################################
      ## Packages
      ##
      ##   nix build              -> ./result/  (built Hugo site)
      ##   nix build .#zapilates
      ######################################################
      packages = forAllSystems (
        { system, pkgs }:
        rec {
          zapilates = pkgs.callPackage ./nix/site.nix {
            source = self;
          };
          default = zapilates;
        }
      );

      ######################################################
      ## NixOS module
      ##
      ##   Consumers reference this flake as an input and
      ##   import `zapilates.nixosModules.default` on their host.
      ######################################################
      nixosModules = {
        zapilates = import ./nix/module.nix { inherit self; };
        default = self.nixosModules.zapilates;
      };

      ######################################################
      ## Apps
      ##
      ##   nix run .#serve  -> build + serve locally on :8000
      ######################################################
      apps = forAllSystems (
        { system, pkgs }:
        {
          serve = {
            type = "app";
            program = toString (
              pkgs.writeShellScript "zapilates-serve" ''
                set -euo pipefail
                site="${self.packages.${system}.zapilates}"
                echo "Serving $site on http://localhost:8000"
                exec ${pkgs.python3}/bin/python3 -m http.server 8000 --directory "$site"
              ''
            );
          };
        }
      );

      ######################################################
      ## Development Shells
      ######################################################
      devShells = forAllSystems (
        { system, pkgs }:
        {
          default = import ./utils/develop.nix {
            inherit
              inputs
              system
              pkgs
              ;
          };
        }
      );
    };
}

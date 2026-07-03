{
  inputs,
  system,
  pkgs,
  ...
}:
pkgs.mkShell {
  packages = [
    # Version control & visualization
    pkgs.git
    pkgs.gource
    pkgs.ffmpeg

    # TUI/CLI tools
    pkgs.gum
    pkgs.chafa

    # Hugo static site generator
    pkgs.hugo
    pkgs.dart-sass
    pkgs.nodejs_22

    # Documentation
    pkgs.python312Packages.mkdocs
    pkgs.python312Packages.mkdocs-material

    # Code quality & linting
    pkgs.pre-commit
    pkgs.nixfmt-rfc-style
    pkgs.bearer
    pkgs.shfmt
    pkgs.markdownlint-cli
    pkgs.actionlint
    pkgs.shellcheck
    pkgs.nodePackages.cspell

    # Presentations & local server
    pkgs.marp-cli
    pkgs.httplz

    # Python for migration scripts
    pkgs.python312
    pkgs.python312Packages.beautifulsoup4
    pkgs.python312Packages.html2text
    pkgs.python312Packages.pyyaml
  ];

  shellHook = ''
    # Run the welcome prompt
    ./utils/prompt.sh
  '';
}

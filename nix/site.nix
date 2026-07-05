{
  lib,
  stdenv,
  hugo,
  dart-sass,
  nodejs,
  source,
  version ? "0.1.0",
}:

stdenv.mkDerivation {
  pname = "zapilates";
  inherit version;

  src = source;

  nativeBuildInputs = [
    hugo
    dart-sass
    nodejs
  ];

  buildPhase = ''
    runHook preBuild

    export HOME=$TMPDIR
    hugo --minify --destination $out

    runHook postBuild
  '';

  dontInstall = true;

  meta = with lib; {
    description = "Zapilates — static Hugo site for zapilates.com";
    homepage = "https://zapilates.com";
    license = licenses.mit;
    platforms = platforms.all;
  };
}

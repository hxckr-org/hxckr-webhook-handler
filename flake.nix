{
  description = "RabbitMQ development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        rabbitmqPort = 5672;
        rabbitmqHost = "localhost";
        rabbitmqUser = "guest";
        rabbitmqPassword = "guest";
        rabbitmqBaseDir = "/tmp/rabbitmq-${builtins.getEnv "USER"}";
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            rabbitmq-server
          ];

          shellHook = ''
            export PATH=${pkgs.rabbitmq-server}/bin:$PATH
            export RABBITMQ_MNESIA_BASE="${rabbitmqBaseDir}/mnesia"
            export RABBITMQ_LOG_BASE="${rabbitmqBaseDir}/log"
            export RABBITMQ_CONFIG_FILE="${rabbitmqBaseDir}/rabbitmq.conf"
            export RABBITMQ_ENABLED_PLUGINS_FILE="${rabbitmqBaseDir}/enabled_plugins"

            mkdir -p $RABBITMQ_MNESIA_BASE $RABBITMQ_LOG_BASE
            touch $RABBITMQ_CONFIG_FILE $RABBITMQ_ENABLED_PLUGINS_FILE

            echo "RabbitMQ development environment"
            echo "Run 'rabbitmq-server' to start RabbitMQ"
            echo ""
            echo "RabbitMQ Connection String:"
            echo "amqp://${rabbitmqUser}:${rabbitmqPassword}@${rabbitmqHost}:${toString rabbitmqPort}"
            echo ""
            echo "RabbitMQ data directory: ${rabbitmqBaseDir}"
            echo ""
            echo "Available commands:"
            echo "  rabbitmq-server    - Start the RabbitMQ server"
            echo "  rabbitmqctl        - RabbitMQ management tool"
            echo "  rabbitmq-plugins   - RabbitMQ plugin management tool"
          '';
        };

        packages.default = pkgs.rabbitmq-server;

        apps.default = {
          type = "app";
          program = "${pkgs.rabbitmq-server}/bin/rabbitmq-server";
        };
      });
}

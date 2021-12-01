
local docker_volume = {
  name: "dockersock",
  path: "/var/run/docker.sock"
};

local docker_volume_host = {
  name: "dockersock",
  host: { 
    path: "/var/run/docker.sock" 
  }
};

local docker_step(name, commands) = {
  name: name,
  image: "docker",
  volumes: [docker_volume],
  commands: commands
};

local test = docker_step("test", ["docker build --target tester ."]); 

local build = docker_step("build", ["docker build ."]);

local clean_up = docker_step("cleanup", ["docker image rm $(docker image ls -qa -f dangling=true)"])
                  + { when: { status: ["failure", "success"] }};

local publish = {
  name: "publish",
  image: "plugins/docker",
  settings: {
    repo: "draive-registry:5000/default/mock-publisher",
    registry: "draive-registry:5000",
    tags: ["latest"],
    username: { from_secret: "username" },
    password: { from_secret: "password" },
    insecure: true
  }
};

{
  kind: "pipeline",
  type: "docker",
  name: "build-test-publish",
  steps: [build, test, publish, clean_up],
  volumes: [docker_volume_host],
  trigger: { branch: ["master"] }
}

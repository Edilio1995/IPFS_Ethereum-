const UploadHash = artifacts.require("UploadHash");

module.exports = function(deployer) {
  deployer.deploy(UploadHash);
};

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MilestoneVault {
    struct Milestone {
        uint256 amount;
        bool released;
    }

    struct Project {
        address creator;
        uint256 balance;
        bool exists;
    }

    mapping(uint256 => Project) public projects;
    mapping(uint256 => Milestone[]) public milestones;
    mapping(uint256 => mapping(address => uint256)) public contributions;

    event ProjectCreated(uint256 indexed projectId, address indexed creator, uint256 milestoneCount);
    event ContributionReceived(uint256 indexed projectId, address indexed funder, uint256 amount);
    event FundsReleased(uint256 indexed projectId, uint256 indexed milestoneId, address indexed recipient, uint256 amount);

    modifier projectExists(uint256 projectId) {
        require(projects[projectId].exists, "Project does not exist");
        _;
    }

    function createProject(uint256 projectId, uint256[] calldata milestoneAmounts) external {
        require(!projects[projectId].exists, "Project already exists");
        require(milestoneAmounts.length > 0 && milestoneAmounts.length <= 5, "Invalid milestone count");
        projects[projectId] = Project({creator: msg.sender, balance: 0, exists: true});
        for (uint256 i = 0; i < milestoneAmounts.length; i++) {
            require(milestoneAmounts[i] > 0, "Milestone amount is zero");
            milestones[projectId].push(Milestone({amount: milestoneAmounts[i], released: false}));
        }
        emit ProjectCreated(projectId, msg.sender, milestoneAmounts.length);
    }

    function contribute(uint256 projectId) external payable projectExists(projectId) {
        require(msg.value > 0, "Contribution is zero");
        projects[projectId].balance += msg.value;
        contributions[projectId][msg.sender] += msg.value;
        emit ContributionReceived(projectId, msg.sender, msg.value);
    }

    function releaseMilestone(uint256 projectId, uint256 milestoneId) external projectExists(projectId) {
        require(msg.sender == projects[projectId].creator, "Only creator can release");
        require(milestoneId < milestones[projectId].length, "Invalid milestone");
        Milestone storage milestone = milestones[projectId][milestoneId];
        require(!milestone.released, "Milestone already released");
        require(projects[projectId].balance >= milestone.amount, "Insufficient vault balance");
        milestone.released = true;
        projects[projectId].balance -= milestone.amount;
        payable(projects[projectId].creator).transfer(milestone.amount);
        emit FundsReleased(projectId, milestoneId, projects[projectId].creator, milestone.amount);
    }
}

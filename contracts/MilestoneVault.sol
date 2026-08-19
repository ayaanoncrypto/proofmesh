pragma solidity ^0.8.24;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

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

    IERC20 public immutable token;
    mapping(uint256 => Project) public projects;
    mapping(uint256 => Milestone[]) public milestones;
    mapping(uint256 => mapping(address => uint256)) public contributions;

    event ProjectCreated(uint256 indexed projectId, address indexed creator, uint256 milestoneCount);
    event ContributionReceived(uint256 indexed projectId, address indexed funder, uint256 amount);
    event FundsReleased(uint256 indexed projectId, uint256 indexed milestoneId, address indexed recipient, uint256 amount);

    constructor(address tokenAddress) {
        require(tokenAddress != address(0), "Invalid token");
        token = IERC20(tokenAddress);
    }

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

    function contribute(uint256 projectId, uint256 amount) external projectExists(projectId) {
        require(amount > 0, "Contribution is zero");
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        projects[projectId].balance += amount;
        contributions[projectId][msg.sender] += amount;
        emit ContributionReceived(projectId, msg.sender, amount);
    }

    function releaseMilestone(uint256 projectId, uint256 milestoneId) external projectExists(projectId) {
        require(msg.sender == projects[projectId].creator, "Only creator can release");
        require(milestoneId < milestones[projectId].length, "Invalid milestone");
        Milestone storage milestone = milestones[projectId][milestoneId];
        require(!milestone.released, "Milestone already released");
        require(projects[projectId].balance >= milestone.amount, "Insufficient vault balance");
        milestone.released = true;
        projects[projectId].balance -= milestone.amount;
        require(token.transfer(projects[projectId].creator, milestone.amount), "Token release failed");
        emit FundsReleased(projectId, milestoneId, projects[projectId].creator, milestone.amount);
    }
}

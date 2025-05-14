type gender = 'Male' | 'Female';

type Rolestype = 'owner' | 'trainer' | 'sales';
type GenderType = 'Male' | 'Female';

interface GymInfo {
	id: number | string;
	gym_name: string;
}

interface NewType {
	name: string;
	phoneNumber: number;
}
interface UserHealthProfileType {
	id: number;
	fullname: string;
	gender: GenderType;
	goal: string;
	contact: string;
	weight: number;
	height: number;
	address: string;
	userid: number;
}

interface UserType {
	name: string;
	email: string;
	id: number;
	trainerid?: number | null;
	trainer?: TrainerType;
	HealthProfile: UserHealthProfileType;
}

interface gym {
	id: string;
	name: string;
	img: string;
}

interface mockUsersType {
	id: number;
	name: string;
	gender: gender;
	todaysAttendance: boolean;
}

interface RegisterInput {
	email: string;
	password: string;
	name: string;
	role: Role;
}

interface RegisterResponse {
	msg: string;
	user: {
		name: string;
		email: string;
	} | null;
}

interface UserFromDBType {
	name: string;
	email: string;
	password: string;
}

interface TrainerType {
	id: number;
	name: string;
	assignedClients: number;
	shift: 'Morning' | 'Evening';
	image: string;
}

interface SignupResponse {
	msg: string;
	owner: {
		id: number;
		gym_auth_token: null;
		name: string;
		role: string;
		email: string;
		password: string;
		gym_id: number;
	};
}

interface TrainersResponse {
	msg: string;
	trainers: Trainer[];
}

type GymDetails = {
	name: string;
	logo: string;
	address: string;
	phone: string;
	email: string;
};

interface FormData {
	username: string;
	password: string;
}

interface User {
	name: string;
	HealthProfile: {
		diet: string;
		id: number;
		fullname: string;
		contact: string;
		weight: number;
		height: number;
		address: string;
		userid: number;
	};
}

interface FetchUserType {
	msg: string;
	data: User[];
}

interface User {
	id: number;
	name: string;
	gender: string;
	goal: string;
	assignedTrainer: string | null;
}

interface Trainer {
	id: number;
	name: string;
}

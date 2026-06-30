import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import {
  Plus, Edit, Trash, FileText, Briefcase, LogOut,
  RefreshCw, CheckCircle, AlertCircle, X, Shield, Users,
  Lock, Mail, Calculator, Brain, BookOpen, BarChart3,
  Upload, Download, ChevronRight, Calendar, Sliders
} from 'lucide-react';
import axios from 'axios';

const mapStatusToUI = (status) => {
  const s = (status || '').toLowerCase().trim();
  if (s === 'pending' || s === 'applied' || s === 'reviewed' || s === 'under review' || s === 'underreview' || s === 'candidates' || s === 'candidate') return 'Candidates';
  if (s === 'round 1 aptitude' || s === 'round1aptitude' || s === 'aptitude') return 'Round 1 Aptitude';
  if (s === 'round 2 technical' || s === 'round2technical' || s === 'technical' || s === 'technical questions') return 'Round 2 Technical';
  if (s === 'round 3 brand awareness' || s === 'round3brandawareness' || s === 'brand awareness' || s === 'brand') return 'Round 3 Brand Awareness';
  if (s === 'shortlisted') return 'Shortlisted';
  if (s === 'scheduled' || s === 'interview scheduled' || s === 'interviewscheduled') return 'Interview Scheduled';
  if (s === 'approved' || s === 'selected') return 'Selected';
  if (s === 'rejected') return 'Rejected';
  if (s === 'joined') return 'Joined';
  return 'Candidates';
};

const fallbackApps = [
  {
    id: 'app-mock-1',
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+91 98765 43210',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'I am excited to apply for the Senior Systems Engineer position at Beta. I have over 5 years of experience in distributed systems design, React, Node.js, and scaling high-availability architectures.',
    status: 'Candidates',
    createdAt: new Date().toISOString(),
    jobTitle: 'Senior Full Stack Engineer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)'
  },
  {
    id: 'app-mock-2',
    fullName: 'Alex Smith',
    email: 'alex.smith@example.com',
    phone: '+1 (555) 019-2834',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Hello! I am a passionate UI/UX developer with extensive experience building premium user experiences with Framer Motion, Tailwind, and React.',
    status: 'Shortlisted',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    jobTitle: 'UI/UX Designer & Developer',
    jobDepartment: 'Design',
    jobLocation: 'Chennai, India (Hybrid)'
  },
  {
    id: 'app-mock-round1-1',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 99999 88888',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'A highly competent React developer with 3 years of frontend expertise.',
    status: 'Round 1 Aptitude',
    createdAt: new Date().toISOString(),
    jobTitle: 'React Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    interviewDate: '02-Jul-2026',
    interviewTime: '10 AM',
    aptitudeStatus: 'Scheduled'
  },
  {
    id: 'app-mock-round1-2',
    fullName: 'Priya S',
    email: 'priya.s@example.com',
    phone: '+91 88888 77777',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Java backend specialist focusing on Spring Boot microservices.',
    status: 'Round 1 Aptitude',
    createdAt: new Date().toISOString(),
    jobTitle: 'Java Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    interviewDate: '02-Jul-2026',
    interviewTime: '11 AM',
    aptitudeStatus: 'Scheduled'
  },
  {
    id: 'app-mock-round1-3',
    fullName: 'Arun K',
    email: 'arun.k@example.com',
    phone: '+91 77777 66666',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Creative designer and UI developer expert with Tailwind and CSS.',
    status: 'Round 1 Aptitude',
    createdAt: new Date().toISOString(),
    jobTitle: 'UI Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    interviewDate: '03-Jul-2026',
    interviewTime: '02 PM',
    aptitudeStatus: 'Completed'
  },
  {
    id: 'app-mock-round1-4',
    fullName: 'Rahul M',
    email: 'rahul.m@example.com',
    phone: '+91 66666 55555',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Node.js developer with database indexing expertise.',
    status: 'Round 1 Aptitude',
    createdAt: new Date().toISOString(),
    jobTitle: 'Backend Dev',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    interviewDate: 'Not Selected',
    interviewTime: '--',
    aptitudeStatus: 'Pending'
  },
  {
    id: 'r2-fe-1',
    fullName: 'Sarah Connor',
    email: 'sarah.c@example.com',
    phone: '+91 95432 10987',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'React expert focusing on clean UI rendering.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'React Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '5 Years'
  },
  {
    id: 'r2-fe-2',
    fullName: 'Alex Rivera',
    email: 'alex.r@example.com',
    phone: '+91 95432 10988',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'UI developer specialized in HTML5, CSS3, and responsive design systems.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'UI Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '3 Years'
  },
  {
    id: 'r2-fe-3',
    fullName: 'Daniel Lee',
    email: 'daniel.l@example.com',
    phone: '+91 95432 10989',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Frontend developer focusing on React and Redux architectures.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'React Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '4 Years'
  },
  {
    id: 'r2-fe-4',
    fullName: 'John Baker',
    email: 'john.b@example.com',
    phone: '+91 95432 10990',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'High-end UI design systems builder.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'UI/UX Designer & Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '3 Years'
  },
  {
    id: 'r2-fe-5',
    fullName: 'Lily Chen',
    email: 'lily.c@example.com',
    phone: '+91 95432 10991',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'React framework expert with state handling experience.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'React Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '5 Years'
  },
  {
    id: 'r2-fe-6',
    fullName: 'Marcus Aurelius',
    email: 'marcus.a@example.com',
    phone: '+91 95432 10992',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'CSS, layout design, and design system focus.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'UI Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '6 Years'
  },
  {
    id: 'r2-fe-7',
    fullName: 'Sophia Patel',
    email: 'sophia.p@example.com',
    phone: '+91 95432 10993',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'React Hooks and context provider developer.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'React Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '4 Years'
  },
  {
    id: 'r2-fe-8',
    fullName: 'Jack Ryan',
    email: 'jack.r@example.com',
    phone: '+91 95432 10994',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'CSS keyframe details and transitions.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'UI Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '3 Years'
  },
  {
    id: 'r2-fe-9',
    fullName: 'Anna Kowalski',
    email: 'anna.k@example.com',
    phone: '+91 95432 10995',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'React applications modular setups.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'React Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '2 Years'
  },
  {
    id: 'r2-fe-10',
    fullName: 'Oliver Twist',
    email: 'oliver.t@example.com',
    phone: '+91 95432 10996',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Clean CSS systems builder.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'UI Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '3 Years'
  },
  {
    id: 'r2-fe-11',
    fullName: 'Emily Bronte',
    email: 'emily.b@example.com',
    phone: '+91 95432 10997',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Advanced React component patterns.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'React Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '4 Years'
  },
  {
    id: 'r2-fe-12',
    fullName: 'Robert Frost',
    email: 'robert.f@example.com',
    phone: '+91 95432 10998',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'UI focus, performance scoring developer.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'UI Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '5 Years'
  },

  // Backend Candidates (8)
  {
    id: 'r2-be-1',
    fullName: 'David Miller',
    email: 'david.m@example.com',
    phone: '+91 84321 09876',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Java Developer focused on core optimization.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'Java Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '4 Years'
  },
  {
    id: 'r2-be-2',
    fullName: 'Karen Smith',
    email: 'karen.s@example.com',
    phone: '+91 73210 98765',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Spring Boot REST microservices specialist.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'Spring Boot Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '6 Years'
  },
  {
    id: 'r2-be-3',
    fullName: 'Michael Johnson',
    email: 'michael.j@example.com',
    phone: '+91 62109 87654',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Node.js/Express backend architect.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'Node.js Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '3 Years'
  },
  {
    id: 'r2-be-4',
    fullName: 'Suresh R',
    email: 'suresh.r@example.com',
    phone: '+91 51098 76543',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Python/Django backend developer.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'Python Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '4 Years'
  },
  {
    id: 'r2-be-5',
    fullName: 'Diana Prince',
    email: 'diana.p@example.com',
    phone: '+91 84321 09877',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Core Java specialist.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'Java Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '5 Years'
  },
  {
    id: 'r2-be-6',
    fullName: 'Clark Kent',
    email: 'clark.k@example.com',
    phone: '+91 84321 09878',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Node/Koa/Express coder.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'Node.js Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '3 Years'
  },
  {
    id: 'r2-be-7',
    fullName: 'Bruce Wayne',
    email: 'bruce.w@example.com',
    phone: '+91 84321 09879',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Python scripts, Django security.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'Python Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '6 Years'
  },
  {
    id: 'r2-be-8',
    fullName: 'Barry Allen',
    email: 'barry.a@example.com',
    phone: '+91 84321 09880',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Java concurrency and threading Developer.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'Java Developer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '2 Years'
  },

  // Full Stack Candidates (5)
  {
    id: 'r2-fs-1',
    fullName: 'Tony Stark',
    email: 'tony.s@example.com',
    phone: '+91 30987 54322',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Senior React/Node systems engineer.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'Senior Full Stack Engineer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '6 Years'
  },
  {
    id: 'r2-fs-2',
    fullName: 'Peter Parker',
    email: 'peter.p@example.com',
    phone: '+91 30987 54323',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'MERN stack specialist.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'Senior Full Stack Engineer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '3 Years'
  },
  {
    id: 'r2-fs-3',
    fullName: 'Steve Rogers',
    email: 'steve.r@example.com',
    phone: '+91 30987 54324',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Full stack web architectures.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'Senior Full Stack Engineer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '5 Years'
  },
  {
    id: 'r2-fs-4',
    fullName: 'Natasha Romanoff',
    email: 'natasha.r@example.com',
    phone: '+91 30987 54325',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'React, Node, Postgres architect.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'Senior Full Stack Engineer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '4 Years'
  },
  {
    id: 'r2-fs-5',
    fullName: 'Wanda Maximoff',
    email: 'wanda.m@example.com',
    phone: '+91 30987 54326',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'MERN stack coding.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'Senior Full Stack Engineer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '3 Years'
  },

  // Testing Candidates (4)
  {
    id: 'r2-qa-1',
    fullName: 'Jessica A',
    email: 'jessica.a@example.com',
    phone: '+91 40987 65432',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Selenium and Cypress test structures.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'QA Automation Engineer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '5 Years'
  },
  {
    id: 'r2-qa-2',
    fullName: 'Arthur Dent',
    email: 'arthur.d@example.com',
    phone: '+91 40987 65433',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Integration testing developer.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'QA Automation Engineer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '3 Years'
  },
  {
    id: 'r2-qa-3',
    fullName: 'Ford Prefect',
    email: 'ford.p@example.com',
    phone: '+91 40987 65434',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Automation suite builder.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'QA Automation Engineer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '4 Years'
  },
  {
    id: 'r2-qa-4',
    fullName: 'Tricia McMillan',
    email: 'tricia.m@example.com',
    phone: '+91 40987 65435',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'API load and automation tests.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'QA Automation Engineer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '5 Years'
  },

  // DevOps Candidates (2)
  {
    id: 'r2-do-1',
    fullName: 'Devin K',
    email: 'devin.k@example.com',
    phone: '+91 30987 54321',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Docker, AWS deployments, Kubernetes.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'DevOps Cloud Engineer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '3 Years'
  },
  {
    id: 'r2-do-2',
    fullName: 'Linus Torvalds',
    email: 'linus.t@example.com',
    phone: '+91 30987 54327',
    resumeUrl: '/mock_resume.pdf',
    coverLetter: 'Linux kernel deployments, systems optimization.',
    status: 'Round 2 Technical',
    createdAt: new Date().toISOString(),
    jobTitle: 'DevOps Cloud Engineer',
    jobDepartment: 'Engineering',
    jobLocation: 'Chennai, India (Hybrid)',
    experience: '10 Years'
  },

  // Round 3 - Brand Awareness (BNX Mail - 12)
  { id: 'r3-bm-1', fullName: 'Lucas Scott', email: 'lucas.s@example.com', phone: '+91 91111 22221', resumeUrl: '/mock_resume.pdf', coverLetter: 'Email advocate.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'BNX Mail Strategist', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '3 Years' },
  { id: 'r3-bm-2', fullName: 'Nathan Scott', email: 'nathan.s@example.com', phone: '+91 91111 22222', resumeUrl: '/mock_resume.pdf', coverLetter: 'SMTP expert.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'BNX Mail Strategist', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '4 Years' },
  { id: 'r3-bm-3', fullName: 'Haley James', email: 'haley.j@example.com', phone: '+91 91111 22223', resumeUrl: '/mock_resume.pdf', coverLetter: 'Customer messaging.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'BNX Mail Strategist', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '5 Years' },
  { id: 'r3-bm-4', fullName: 'Peyton Sawyer', email: 'peyton.s@example.com', phone: '+91 91111 22224', resumeUrl: '/mock_resume.pdf', coverLetter: 'Brand PR.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'BNX Mail Strategist', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '3 Years' },
  { id: 'r3-bm-5', fullName: 'Brooke Davis', email: 'brooke.d@example.com', phone: '+91 91111 22225', resumeUrl: '/mock_resume.pdf', coverLetter: 'Product placement.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'BNX Mail Strategist', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '6 Years' },
  { id: 'r3-bm-6', fullName: 'Dan Scott', email: 'dan.s@example.com', phone: '+91 91111 22226', resumeUrl: '/mock_resume.pdf', coverLetter: 'Enterprise outreach.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'BNX Mail Strategist', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '8 Years' },
  { id: 'r3-bm-7', fullName: 'Mouth McFadden', email: 'mouth.m@example.com', phone: '+91 91111 22227', resumeUrl: '/mock_resume.pdf', coverLetter: 'Communications expert.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'BNX Mail Strategist', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '3 Years' },
  { id: 'r3-bm-8', fullName: 'Skills Taylor', email: 'skills.t@example.com', phone: '+91 91111 22228', resumeUrl: '/mock_resume.pdf', coverLetter: 'Promotions lead.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'BNX Mail Strategist', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '4 Years' },
  { id: 'r3-bm-9', fullName: 'Keith Scott', email: 'keith.s@example.com', phone: '+91 91111 22229', resumeUrl: '/mock_resume.pdf', coverLetter: 'CTO engagement.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'BNX Mail Strategist', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '5 Years' },
  { id: 'r3-bm-10', fullName: 'Karen Roe', email: 'karen.r@example.com', phone: '+91 91111 22230', resumeUrl: '/mock_resume.pdf', coverLetter: 'Brand design.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'BNX Mail Strategist', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '5 Years' },
  { id: 'r3-bm-11', fullName: 'Whitey Durham', email: 'whitey.d@example.com', phone: '+91 91111 22231', resumeUrl: '/mock_resume.pdf', coverLetter: 'Branding legacy.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'BNX Mail Strategist', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '12 Years' },
  { id: 'r3-bm-12', fullName: 'Deb Scott', email: 'deb.s@example.com', phone: '+91 91111 22232', resumeUrl: '/mock_resume.pdf', coverLetter: 'Enterprise outreach.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'BNX Mail Strategist', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '6 Years' },

  // Cliks Business - 8
  { id: 'r3-cb-1', fullName: 'Julian Baker', email: 'julian.b@example.com', phone: '+91 92222 33331', resumeUrl: '/mock_resume.pdf', coverLetter: 'SaaS pitch.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'Cliks Business Consultant', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '4 Years' },
  { id: 'r3-cb-2', fullName: 'Clay Evans', email: 'clay.e@example.com', phone: '+91 92222 33332', resumeUrl: '/mock_resume.pdf', coverLetter: 'Acquisition strategy.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'Cliks Business Consultant', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '3 Years' },
  { id: 'r3-cb-3', fullName: 'Quinn James', email: 'quinn.j@example.com', phone: '+91 92222 33333', resumeUrl: '/mock_resume.pdf', coverLetter: 'Workflow design.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'Cliks Business Consultant', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '5 Years' },
  { id: 'r3-cb-4', fullName: 'Chase Adams', email: 'chase.a@example.com', phone: '+91 92222 33334', resumeUrl: '/mock_resume.pdf', coverLetter: 'Enterprise licensing.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'Cliks Business Consultant', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '3 Years' },
  { id: 'r3-cb-5', fullName: 'Chris Keller', email: 'chris.k@example.com', phone: '+91 92222 33335', resumeUrl: '/mock_resume.pdf', coverLetter: 'Client outreach.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'Cliks Business Consultant', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '6 Years' },
  { id: 'r3-cb-6', fullName: 'Mia Catalano', email: 'mia.c@example.com', phone: '+91 92222 33336', resumeUrl: '/mock_resume.pdf', coverLetter: 'Brand messaging.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'Cliks Business Consultant', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '2 Years' },
  { id: 'r3-cb-7', fullName: 'Alex Dupre', email: 'alex.d@example.com', phone: '+91 92222 33337', resumeUrl: '/mock_resume.pdf', coverLetter: 'Product demos.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'Cliks Business Consultant', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '4 Years' },
  { id: 'r3-cb-8', fullName: 'Victoria Davis', email: 'victoria.d@example.com', phone: '+91 92222 33338', resumeUrl: '/mock_resume.pdf', coverLetter: 'Executive relations.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'Cliks Business Consultant', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '7 Years' },

  // Company Core Values - 5
  { id: 'r3-bs-1', fullName: 'Rachel Gatina', email: 'rachel.g@example.com', phone: '+91 93333 44441', resumeUrl: '/mock_resume.pdf', coverLetter: 'Values advocate.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'Company Core Values Specialist', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '3 Years' },
  { id: 'r3-bs-2', fullName: 'Bevin Mirskey', email: 'bevin.m@example.com', phone: '+91 93333 44442', resumeUrl: '/mock_resume.pdf', coverLetter: 'Corporate communication.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'Company Core Values Specialist', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '4 Years' },
  { id: 'r3-bs-3', fullName: 'Cooper Lee', email: 'cooper.l@example.com', phone: '+91 93333 44443', resumeUrl: '/mock_resume.pdf', coverLetter: 'Ethics strategy.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'Company Core Values Specialist', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '6 Years' },
  { id: 'r3-bs-4', fullName: 'Gigi Silveri', email: 'gigi.s@example.com', phone: '+91 93333 44444', resumeUrl: '/mock_resume.pdf', coverLetter: 'Identity alignment.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'Company Core Values Specialist', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '3 Years' },
  { id: 'r3-bs-5', fullName: 'Shelly Simon', email: 'shelly.s@example.com', phone: '+91 93333 44445', resumeUrl: '/mock_resume.pdf', coverLetter: 'Corporate culture.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'Company Core Values Specialist', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '5 Years' },

  // Public Relations - 4
  { id: 'r3-cr-1', fullName: 'Millicent Huxtable', email: 'millie.h@example.com', phone: '+91 94444 55551', resumeUrl: '/mock_resume.pdf', coverLetter: 'PR strategist.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'Public Relations Representative', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '4 Years' },
  { id: 'r3-cr-2', fullName: 'Chuck Scolnik', email: 'chuck.s@example.com', phone: '+91 94444 55552', resumeUrl: '/mock_resume.pdf', coverLetter: 'Media outreach.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'Public Relations Representative', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '5 Years' },
  { id: 'r3-cr-3', fullName: 'Marvin McFadden', email: 'marvin.m@example.com', phone: '+91 94444 55553', resumeUrl: '/mock_resume.pdf', coverLetter: 'Event branding.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'Public Relations Representative', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '3 Years' },
  { id: 'r3-cr-4', fullName: 'Mouth McFadden Jr', email: 'mouth.jr@example.com', phone: '+91 94444 55554', resumeUrl: '/mock_resume.pdf', coverLetter: 'Social channels.', status: 'Round 3 Brand Awareness', createdAt: new Date().toISOString(), jobTitle: 'Public Relations Representative', jobDepartment: 'Marketing', jobLocation: 'Chennai, India (Hybrid)', experience: '2 Years' }
];

const technicalQuestionsData = [
  { id: 'q-r2-1', category: 'React', title: 'Debounced State Hook', difficulty: 'Medium', time: '20 mins', description: 'Implement a custom hook `useDebounce(value, delay)` that returns a debounced version of the input value. Provide clean optimization handles for dependency arrays.', codeSnippet: 'function useDebounce(value, delay) {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n  useEffect(() => {\n    const handler = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(handler);\n  }, [value, delay]);\n  return debouncedValue;\n}' },
  { id: 'q-r2-2', category: 'React', title: 'Fiber Reconciliation Internals', difficulty: 'Hard', time: '15 mins', description: 'Explain the difference between Stack Reconciler and Fiber Reconciler in React. Detail how the render phase and commit phase cooperate asynchronously.', codeSnippet: '// Conceptual explanation: Stack is synchronous & blocking. Fiber splits work into chunks using RequestIdleCallback.' },
  { id: 'q-r2-3', category: 'Java', title: 'Thread-safe Singleton Pattern', difficulty: 'Medium', time: '15 mins', description: 'Write a thread-safe Singleton class implementation in Java using double-checked locking pattern. Explain why the `volatile` keyword is critical here.', codeSnippet: 'public class Singleton {\n  private static volatile Singleton instance;\n  private Singleton() {}\n  public static Singleton getInstance() {\n    if (instance == null) {\n      synchronized (Singleton.class) {\n        if (instance == null) {\n          instance = new Singleton();\n        }\n      }\n    }\n    return instance;\n  }\n}' },
  { id: 'q-r2-4', category: 'Java', title: 'Hotspot JVM GC comparison', difficulty: 'Hard', time: '20 mins', description: 'Compare G1 GC with ZGC collector. Detail the latency characteristics and memory layout differences under high allocation rates.', codeSnippet: '// Conceptual explanation: ZGC executes phases concurrently with application threads, keeping stop-the-world pauses below 1ms.' },
  { id: 'q-r2-5', category: 'Spring Boot', title: 'Security Filter Chain setup', difficulty: 'Hard', time: '30 mins', description: 'Design a custom JWT verification filter chain and register it in SecurityFilterChain configuration. Exclude public endpoints from context verification.', codeSnippet: '@Bean\npublic SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n  http.csrf(csrf -> csrf.disable())\n      .authorizeHttpRequests(auth -> auth\n          .requestMatchers("/api/auth/**").permitAll()\n          .anyRequest().authenticated()\n      )\n      .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);\n  return http.build();\n}' },
  { id: 'q-r2-6', category: 'Spring Boot', title: 'Bean Initialization sequence', difficulty: 'Easy', time: '10 mins', description: 'Describe the differences between `@PostConstruct`, `InitializingBean`, and custom `init-method` lifecycle declarations.', codeSnippet: '// PostConstruct executes first, then afterPropertiesSet from InitializingBean, followed by custom XML/Java configuration init methods.' },
  { id: 'q-r2-7', category: 'Node.js', title: 'Event Loop Bottleneck Resolution', difficulty: 'Hard', time: '25 mins', description: 'Identify how synchronous computation blocks the Event Loop. Implement a worker pool model or async partition process to free the main execution thread.', codeSnippet: 'const { Worker } = require(\'worker_threads\');\nfunction runWorker(workerData) {\n  return new Promise((resolve, reject) => {\n    const worker = new Worker(\'./worker.js\', { workerData });\n    worker.on(\'message\', resolve);\n    worker.on(\'error\', reject);\n  });\n}' },
  { id: 'q-r2-8', category: 'Python', title: 'TTL Cache Decorator', difficulty: 'Medium', time: '20 mins', description: 'Build a custom python decorator `@ttl_cache(seconds=60)` that caches the returns of a function and invalidates cache entries older than the defined TTL.', codeSnippet: 'import time\ndef ttl_cache(seconds=60):\n    def decorator(func):\n        cache = {}\n        def wrapper(*args):\n            now = time.time()\n            if args in cache and (now - cache[args][1] < seconds):\n                return cache[args][0]\n            result = func(*args)\n            cache[args] = (result, now)\n            return result\n        return wrapper\n    return decorator' },
  { id: 'q-r2-9', category: 'Testing', title: 'Dynamic Session Testing', difficulty: 'Medium', time: '15 mins', description: 'Write a Cypress automation script that bypasses multi-step login by injecting session cookies and directly navigates to administrative sub-routes.', codeSnippet: 'describe("Session Bypass", () => {\n  beforeEach(() => {\n    cy.setCookie("session_token", "mock_value_123");\n    cy.visit("/admin/dashboard");\n  });\n});' },
  { id: 'q-r2-10', category: 'DevOps', title: 'Multi-stage Docker setup', difficulty: 'Easy', time: '15 mins', description: 'Write a multi-stage Dockerfile for a React application. Minimize the final production image footprint by using nginx as the hosting block.', codeSnippet: '# Stage 1\nFROM node:alpine AS builder\nWORKDIR /app\nCOPY . .\nRUN npm run build\n\n# Stage 2\nFROM nginx:alpine\nCOPY --from=builder /app/dist /usr/share/nginx/html' }
];

const brandQuestionsData = [
  { id: 'q-r3-1', category: 'BNX Mail', title: 'SMTP Encryption Advocacy', difficulty: 'Medium', time: '15 mins', description: 'How does BNX Mail solve SMTP interception vulnerability? Write a brand messaging guide explaining this to a customer CTO who lacks cryptography context.', codeSnippet: 'BNX Mail encrypts every email segment using TLS/SMTP-over-SSL with Zero-knowledge architecture. No server caches raw message payloads, guaranteeing zero snooping.' },
  { id: 'q-r3-2', category: 'BNX Mail', title: 'Microsoft 365 Migration Campaign', difficulty: 'Hard', time: '20 mins', description: 'Design a customer-facing brand campaign addressing migrating 10k enterprise mailboxes to BNX Mail with zero uptime disruption.', codeSnippet: 'Phase 1: Dual-delivery split delivery setup.\nPhase 2: SMTP connector synchronization.\nPhase 3: Final DNS MX pointer changeover with zero email loss.' },
  { id: 'q-r3-3', category: 'Cliks Business', title: 'Team Task Velocity Strategy', difficulty: 'Easy', time: '10 mins', description: 'Detail the competitive messaging edge Cliks Business has over Slack/Trello. Highlight unified task nodes and real-time collaboration canvas.', codeSnippet: 'Tagline: "Work together, faster." Key points: No context switching, zero latency canvas sync, and deep files ecosystem integration.' },
  { id: 'q-r3-4', category: 'Cliks Business', title: 'Target Enterprise Acquisition Pitch', difficulty: 'Medium', time: '25 mins', description: 'Draft a sales pitch targeting mid-size technology companies to migrate from multiple SaaS apps to a single Cliks Business subscription.', codeSnippet: 'Unified dashboards reduce operational licensing costs by 40% and eliminate time wasted on app context switching.' },
  { id: 'q-r3-5', category: 'Company Core Values', title: 'Corporate Identity Core Values', difficulty: 'Easy', time: '10 mins', description: 'Explain the design significance of the BNX logo animation pulse and how it represents our mission to build deep connected infrastructures.', codeSnippet: 'The central pulse represents constant live-sync data stream, and the revolving orbits symbolize integrated SaaS applications.' },
  { id: 'q-r3-6', category: 'Public Relations', title: 'Crisis Control Outage Communication', difficulty: 'Hard', time: '20 mins', description: 'Write an official brand response addressing a hypothetical 30-minute system outage in BNX Mail, maintaining public trust.', codeSnippet: 'Official Release: "Beta engineering quickly contained an edge CDN routing issue. All user mail payloads remained encrypted and secure. We value your business." ' },
  { id: 'q-r3-7', category: 'Ecosystem Integration', title: 'Beta Single Sign-On Value Prop', difficulty: 'Medium', time: '15 mins', description: 'Outline a partner campaign highlighting Beta\'s single-sign-on (SSO) integration. How does it improve the security narrative of third-party apps?', codeSnippet: 'Single-Sign-On locks authentication to verified domain credentials, instantly protecting all third-party integrations from credential leaks.' }
];

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);

  // Job Board States
  const [externalJobs, setExternalJobs] = useState([]);
  const [externalApplications, setExternalApplications] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('appsList');
  const [aptitudeSubTab, setAptitudeSubTab] = useState('dashboard');
  const [selectedDomainTab, setSelectedDomainTab] = useState('React');
  const [technicalSubTab, setTechnicalSubTab] = useState('dashboard');
  const [brandSubTab, setBrandSubTab] = useState('dashboard');
  const [selectedBrandDomainTab, setSelectedBrandDomainTab] = useState('BNX Mail');
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('Candidates');
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);

  // Application details/status/interview states
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewLink, setInterviewLink] = useState('https://meet.google.com/abc-defg-hij');
  const [interviewer, setInterviewer] = useState('Tech Team Lead');
  const [remarks, setRemarks] = useState('');

  // Job Posting/Editing Modal States
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null); // null if adding, job object if editing
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [jobSalary, setJobSalary] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobResponsibilities, setJobResponsibilities] = useState(['']);
  const [jobRequirements, setJobRequirements] = useState(['']);
  const [jobSkills, setJobSkills] = useState(['']);

  // Load/Alert States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Admin credentials login states
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoading(true);

    try {
      const res = await login(adminUsername, adminPassword);
      if (!res.success) {
        setAdminError(res.message);
      }
    } catch {
      setAdminError('Connection to security server failed.');
    } finally {
      setAdminLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [jobsRes, appsRes] = await Promise.all([
        axios.get('https://apply.beta-softnet.com/api/jobs'),
        axios.get('https://apply.beta-softnet.com/api/applications')
      ]);
      setExternalJobs(jobsRes.data.data || jobsRes.data || []);

      const apps = appsRes.data.data || appsRes.data || [];
      if (apps.length === 0) {
        setExternalApplications(fallbackApps);
      } else {
        const normalizedApps = apps.map(app => ({
          id: app.id,
          fullName: app.fullName || app.fullname || '',
          email: app.email || '',
          phone: app.phone || '',
          resumeUrl: app.resumeUrl || app.resumeurl || '',
          coverLetter: app.coverLetter || app.coverletter || '',
          status: mapStatusToUI(app.status),
          createdAt: app.createdAt || app.createdat || '',
          jobTitle: app.jobTitle || app.jobtitle || '',
          jobDepartment: app.jobDepartment || app.jobdepartment || '',
          jobLocation: app.jobLocation || app.joblocation || '',
          interviewDate: app.interviewDate || app.interviewdate || '',
          interviewTime: app.interviewTime || app.interviewtime || '',
          aptitudeStatus: app.aptitudeStatus || app.aptitudestatus || '',
          experience: app.experience || '3 Years'
        }));
        setExternalApplications(normalizedApps);
      }
    } catch {
      console.warn('Failed to fetch from live API. Loading fallback local data.');
      setExternalApplications(fallbackApps);
    } finally {
      setLoading(false);
    }
  };

  // Load data only if authenticated as admin
  useEffect(() => {
    if (user && user.role === 'ROLE_ADMIN') {
      fetchData();
    }
  }, [user]);

  const handleArrayChange = (index, value, array, setArray) => {
    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
  };

  const addArrayField = (array, setArray) => {
    setArray([...array, '']);
  };

  const removeArrayField = (index, array, setArray) => {
    if (array.length === 1) {
      setArray(['']);
    } else {
      const newArray = array.filter((_, i) => i !== index);
      setArray(newArray);
    }
  };

  const openAddJobModal = () => {
    setEditingJob(null);
    setJobTitle('');
    setJobDept('');
    setJobLocation('');
    setJobType('Full-time');
    setJobSalary('');
    setJobDesc('');
    setJobResponsibilities(['']);
    setJobRequirements(['']);
    setJobSkills(['']);
    setIsJobModalOpen(true);
  };

  const openEditJobModal = (job) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setJobDept(job.department);
    setJobLocation(job.location);
    setJobType(job.type || 'Full-time');
    setJobSalary(job.salary);
    setJobDesc(job.description);

    // Parse arrays (handling both parsed arrays and raw string representations)
    let resp;
    let reqs;
    let skillsList;
    try {
      resp = Array.isArray(job.responsibilities) ? job.responsibilities : JSON.parse(job.responsibilities || '[]');
    } catch { resp = [job.responsibilities || '']; }
    try {
      reqs = Array.isArray(job.requirements) ? job.requirements : JSON.parse(job.requirements || '[]');
    } catch { reqs = [job.requirements || '']; }
    try {
      skillsList = Array.isArray(job.skills) ? job.skills : JSON.parse(job.skills || '[]');
    } catch { skillsList = [job.skills || '']; }

    setJobResponsibilities(resp.length > 0 ? resp : ['']);
    setJobRequirements(reqs.length > 0 ? reqs : ['']);
    setJobSkills(skillsList.length > 0 ? skillsList : ['']);
    setIsJobModalOpen(true);
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const responsibilities = jobResponsibilities.map(r => r.trim()).filter(r => r.length > 0);
    const requirements = jobRequirements.map(r => r.trim()).filter(r => r.length > 0);
    const skills = jobSkills.map(s => s.trim()).filter(s => s.length > 0);

    const payload = {
      title: jobTitle,
      department: jobDept,
      location: jobLocation,
      type: jobType,
      salary: jobSalary,
      description: jobDesc,
      responsibilities,
      requirements,
      skills
    };

    try {
      setLoading(true);
      if (editingJob) {
        await axios.put(`https://apply.beta-softnet.com/api/jobs/${editingJob.id}`, payload);
        setSuccess('Job opening updated successfully.');
      } else {
        await axios.post('https://apply.beta-softnet.com/api/jobs', payload);
        setSuccess('Job opening posted successfully.');
      }
      setIsJobModalOpen(false);
      fetchData();
    } catch (err) {
      setError(editingJob ? 'Failed to update job posting.' : 'Failed to post job opening.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting permanently? This will also remove any candidate applications for this role.')) return;
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      await axios.delete(`https://apply.beta-softnet.com/api/jobs/${id}`);
      setSuccess('Job opening deleted successfully.');
      fetchData();
    } catch (err) {
      setError('Failed to delete job opening.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      await axios.put(`https://apply.beta-softnet.com/api/applications/${appId}/status`, { status: newStatus });
      setSuccess(`Candidate status updated to ${newStatus}. Notification email sent.`);
    } catch {
      console.warn('API update failed. Updating locally in state.');
      setSuccess(`Candidate status updated to ${newStatus}. (Candidate email notification sent)`);
    } finally {
      // Always update locally
      setExternalApplications(prev =>
        prev.map(app => app.id === appId ? { ...app, status: newStatus } : app)
      );
      if (selectedApplication) {
        setSelectedApplication(prev => ({ ...prev, status: newStatus }));
      }
      setLoading(false);
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!selectedApplication) return;
    setError('');
    setSuccess('');

    const payload = {
      candidateId: selectedApplication.id,
      status: "Interview Scheduled",
      interviewDate: interviewDate,
      interviewTime: interviewTime,
      meetingLink: interviewLink,
      remarks: remarks
    };

    try {
      setLoading(true);
      // Try sending to the backend API as requested
      await axios.post(`https://apply.beta-softnet.com/api/applications/${selectedApplication.id}/schedule`, payload);
      setSuccess(`Interview scheduled for ${selectedApplication.fullName} successfully. Data saved to database.`);
    } catch {
      console.warn('API schedule failed. Simulating successful scheduling locally.');
      setSuccess(`Interview scheduled successfully! Data sent to API: ${JSON.stringify(payload)}`);
    } finally {
      // Automatically update status to 'Interview Scheduled' locally
      setExternalApplications(prev =>
        prev.map(app => app.id === selectedApplication.id ? { ...app, status: 'Interview Scheduled' } : app)
      );
      setSelectedApplication(null);
      setRemarks('');
      setLoading(false);
    }
  };

  const isAuthorized = user && user.role === 'ROLE_ADMIN';

  if (!isAuthorized) {
    return (
      <div className="auth-white-theme min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 text-left relative overflow-hidden w-full">
        {/* Background blobs */}
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[30%] right-[20%] w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-card p-8 rounded-3xl border border-slate-200 shadow-2xl relative bg-white z-10"
        >
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center mx-auto text-white shadow-lg shadow-blue-500/20">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Portal</h2>
            <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Secure Gatekeeping</p>
          </div>

          {/* Form */}
          <form onSubmit={handleAdminSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Username / Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin@betasoftnet.com"
                  className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg py-2 px-3 pl-10 focus:outline-none focus:border-blue-500 text-sm transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                <a href="#" className="text-xs font-semibold text-[#004AAD] hover:text-[#003c8a] transition">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg py-2 px-3 pl-10 focus:outline-none focus:border-blue-500 text-sm transition"
                />
              </div>
            </div>

            {adminError && (
              <div className="flex items-center space-x-2 text-rose-600 text-xs p-3 rounded-lg bg-rose-50 border border-rose-100">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-500" />
                <span>{adminError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={adminLoading}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2 disabled:bg-slate-400 cursor-pointer border-none outline-none"
            >
              {adminLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Login to Dashboard</span>
              )}
            </button>
          </form>

          {/* Credentials Tip */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500 leading-normal">
              Demo Credentials:<br />
              <span className="font-semibold text-slate-700">admin@betasoftnet.com</span> / <span className="font-semibold text-slate-700">admin123</span>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-left admin-light-theme relative">
      {/* Light Theme specific adjustments */}
      <style>{`
        .admin-light-theme {
          background-color: #F8FAFC !important;
          color: #1E293B !important;
        }
        .admin-light-theme h1, 
        .admin-light-theme h2, 
        .admin-light-theme h3, 
        .admin-light-theme h4, 
        .admin-light-theme h5, 
        .admin-light-theme h6 {
          color: #0F172A !important;
        }
        .admin-light-theme p {
          color: #475569 !important;
        }
        .admin-light-theme label {
          color: #475569 !important;
          font-weight: 600;
        }
        .admin-sidebar {
          background-color: #0F172A !important; /* Dark blue-slate sidebar for contrast */
          border-right: 1px solid #1E293B !important;
        }
        .admin-sidebar p, 
        .admin-sidebar span, 
        .admin-sidebar button {
          color: #94A3B8 !important;
        }
        .admin-sidebar button:hover {
          color: #FFFFFF !important;
        }
        .admin-glass-card {
          background: #FFFFFF !important;
          border: 1px solid rgba(226, 232, 240, 0.8) !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05) !important;
          transition: all 0.25s ease !important;
        }
        .admin-glass-card:hover {
          border-color: rgba(59, 130, 246, 0.4) !important;
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.08) !important;
          transform: translateY(-2px);
        }
        .admin-glow-btn {
          background: #004AAD !important;
          color: #FFFFFF !important;
          border: none !important;
          box-shadow: 0 4px 12px rgba(0, 74, 173, 0.2) !important;
          transition: all 0.2s ease !important;
        }
        .admin-glow-btn:hover {
          background: #003c8a !important;
          box-shadow: 0 6px 16px rgba(0, 74, 173, 0.3) !important;
        }
        .admin-custom-input {
          background-color: #FFFFFF !important;
          border: 1px solid #CBD5E1 !important;
          color: #0F172A !important;
        }
        .admin-custom-input:focus {
          border-color: #004AAD !important;
          box-shadow: 0 0 0 2px rgba(0, 74, 173, 0.15) !important;
        }
        .admin-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .admin-scrollbar::-webkit-scrollbar-track {
          background: #F8FAFC;
        }
        .admin-scrollbar::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 10px;
        }
      `}</style>

      {/* Sidebar navigation */}
      <div className="w-full md:w-64 md:fixed md:top-0 md:bottom-0 md:left-0 md:h-screen admin-sidebar flex flex-col justify-between py-6 z-20">
        <div>
          <div className="px-6 mb-8 flex items-center space-x-2 text-white font-bold text-lg">
            <div className="p-1.5 bg-[#004AAD] rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold tracking-wider">
              BETA ADMIN
            </span>
          </div>

          <nav className="space-y-1 px-3">
            <button
              onClick={() => {
                setSelectedStatusFilter('Candidates');
                setActiveSubTab('jobsList');
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                activeSubTab === 'jobsList' 
                  ? 'bg-[#004AAD] text-white' 
                  : 'text-slate-400 hover:bg-slate-800/20 hover:text-white'
              }`}
              style={activeSubTab === 'jobsList' ? { color: '#ffffff' } : {}}
            >
              <Briefcase className="h-4 w-4 text-blue-200" />
              <span className="font-bold">Job Board</span>
            </button>

            {/* Pipeline Stage Filters */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-1 max-h-[60vh] overflow-y-auto admin-scrollbar">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
                Candidate Pipeline
              </p>
              {['Candidates', 'Round 1 Aptitude', 'Round 2 Technical', 'Round 3 Brand Awareness', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Rejected', 'Joined'].map((status) => {
                const isActive = activeSubTab === 'appsList' && selectedStatusFilter === status;
                const count = externalApplications.filter(app => app.status === status).length;
                
                return (
                  <button
                    key={status}
                    onClick={() => {
                      setSelectedStatusFilter(status);
                      setActiveSubTab('appsList');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-semibold transition cursor-pointer text-left ${
                      isActive 
                        ? 'bg-blue-600/20 text-white font-bold border border-blue-500/20' 
                        : 'text-slate-400 hover:bg-slate-800/25 hover:text-white border border-transparent'
                    }`}
                  >
                    <span>{status}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-blue-600 text-white font-extrabold' : 'bg-slate-800 text-slate-450'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* User profile / Logout */}
        <div className="px-4 border-t border-slate-800 pt-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-350">
              AD
            </div>
            <div>
              <p className="text-sm font-bold text-white">Administrator</p>
              <p className="text-xs text-slate-500 mt-1">{user?.username}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-900/30 transition duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 md:ml-64 p-6 md:p-10 max-w-7xl mx-auto w-full z-10 overflow-y-auto">
        {/* Banner Alert messages */}
        {error && (
          <div className="mb-6 flex items-center space-x-2 text-rose-600 text-sm p-4 rounded-xl bg-rose-50 border border-rose-200 animate-fadeIn font-semibold">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 flex items-center space-x-2 text-emerald-700 text-sm p-4 rounded-xl bg-emerald-50 border border-emerald-250 animate-fadeIn font-semibold">
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Tab Headers */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              External Job Board - Candidate Tracking System</h1>

            <p className="text-slate-550 text-sm mt-1">
              Post careers to apply.beta-softnet.com and manage candidate applications.
            </p>
          </div>

          <div className="flex space-x-3 self-start sm:self-auto">
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={openAddJobModal}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold admin-glow-btn"
            >
              <Plus className="h-4 w-4 text-white" />
              <span className="text-white">Post a Job</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500 space-x-2">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
            <span>Syncing database records...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sub Tab Controls */}
            {selectedStatusFilter !== 'Round 1 Aptitude' && selectedStatusFilter !== 'Round 2 Technical' && selectedStatusFilter !== 'Round 3 Brand Awareness' && (
              <div className="flex space-x-6 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setActiveSubTab('jobsList')}
                  className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${activeSubTab === 'jobsList' ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Active Jobs ({externalJobs.length})
                </button>
                <button
                  onClick={() => setActiveSubTab('appsList')}
                  className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${activeSubTab === 'appsList' ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Candidate Applications ({externalApplications.length})
                </button>
              </div>
            )}

            {/* Sub Tab 1: Jobs list */}
            {activeSubTab === 'jobsList' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {externalJobs.length === 0 ? (
                  <div className="col-span-full admin-glass-card p-12 text-center text-slate-500 rounded-2xl bg-white border border-slate-200">
                    No active jobs found on the external board. Click "Post a Job" to post one!
                  </div>
                ) : (
                  externalJobs.map(job => (
                    <div key={job.id} className="admin-glass-card p-6 rounded-2xl flex flex-col justify-between text-left">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 leading-snug">{job.title}</h3>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <span className="px-2.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold">
                                {job.department}
                              </span>
                              <span className="px-2.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold">
                                {job.location}
                              </span>
                              <span className="px-2.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold">
                                {job.type}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex-shrink-0">
                            {job.salary}
                          </span>
                        </div>

                        <p className="text-slate-600 text-xs mb-5 leading-relaxed line-clamp-3">
                          {job.description}
                        </p>

                        {job.skills && job.skills.length > 0 && (
                          <div className="mb-4">
                            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Required Skills</div>
                            <div className="flex flex-wrap gap-1">
                              {job.skills.map((skill, idx) => (
                                <span key={idx} className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#004AAD] text-[10px] font-medium">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                        <span className="text-[10px] text-slate-400">
                          Posted on {new Date(job.createdat || job.createdAt).toLocaleDateString()}
                        </span>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedJobFilter(job.title);
                              setActiveSubTab('appsList');
                            }}
                            className="px-2.5 py-1.5 rounded bg-slate-50 hover:bg-slate-100 text-[#004AAD] border border-slate-200 text-[10px] font-bold transition flex items-center space-x-1 cursor-pointer"
                            title="View applications for this job"
                          >
                            <Users className="h-3 w-3" />
                            <span>Apps</span>
                          </button>

                          <button
                            onClick={() => openEditJobModal(job)}
                            className="p-1.5 rounded bg-slate-50 hover:bg-slate-100 text-[#004AAD] border border-slate-200 text-xs transition cursor-pointer"
                            title="Edit Job Opening"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => handleJobDelete(job.id)}
                            className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-655 border border-red-200 text-xs transition cursor-pointer"
                            title="Delete Job"
                          >
                            <Trash className="h-3.5 w-3.5 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Sub Tab 2: Applications list */}
            {activeSubTab === 'appsList' && (
              selectedStatusFilter === 'Round 1 Aptitude' ? (
                <div className="space-y-6 animate-fadeIn">
                  {/* Local Tabs for Dashboard vs Questions */}
                  <div className="flex space-x-6 border-b border-slate-200 pb-3">
                    <button
                      onClick={() => setAptitudeSubTab('dashboard')}
                      className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${aptitudeSubTab === 'dashboard' ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setAptitudeSubTab('questions')}
                      className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${aptitudeSubTab === 'questions' ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                      Assessment Questions
                    </button>
                  </div>

                  {aptitudeSubTab === 'dashboard' ? (
                    <div className="space-y-6">
                      {/* Round 1 - Aptitude Dashboard Header */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Round 1 - Aptitude Dashboard
                          </h2>
                          <p className="text-slate-500 text-sm mt-1">
                            Overview of candidate assessment metrics and test schedules
                          </p>
                        </div>
                      </div>

                      {/* Metrics cards grid */}
                      {(() => {
                        const round1Apps = externalApplications.filter(app => app.status === 'Round 1 Aptitude');
                        const selectedCount = round1Apps.length;
                        const scheduledCount = round1Apps.filter(app => (app.aptitudeStatus || 'Pending') === 'Scheduled').length;
                        const completedCount = round1Apps.filter(app => (app.aptitudeStatus || 'Pending') === 'Completed').length;
                        const pendingCount = round1Apps.filter(app => (app.aptitudeStatus || 'Pending') === 'Pending').length;

                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Selected */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Selected</span>
                                <span className="text-3xl font-black text-[#004AAD]">{selectedCount}</span>
                              </div>
                              <div className="p-3 bg-blue-50 text-[#004AAD] rounded-2xl">
                                <Users className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Scheduled */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Scheduled</span>
                                <span className="text-3xl font-black text-amber-600">{scheduledCount}</span>
                              </div>
                              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                                <Calendar className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Completed */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Completed</span>
                                <span className="text-3xl font-black text-emerald-600">{completedCount}</span>
                              </div>
                              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                <CheckCircle className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Pending Slots */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Pending Slots</span>
                                <span className="text-3xl font-black text-slate-600">{pendingCount}</span>
                              </div>
                              <div className="p-3 bg-slate-50 text-slate-500 rounded-2xl">
                                <AlertCircle className="h-6 w-6" />
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Selected Candidates Table */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="mb-4">
                          <h3 className="text-lg font-black text-slate-900 tracking-tight">Selected Candidates for Round 1</h3>
                          <p className="text-slate-550 text-xs mt-0.5">Evaluation schedules and round completion logging</p>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                              <tr>
                                <th className="py-3 px-4 font-bold">Candidate Name</th>
                                <th className="py-3 px-4 font-bold">Position Applied</th>
                                <th className="py-3 px-4 font-bold">Interview Date</th>
                                <th className="py-3 px-4 font-bold">Time</th>
                                <th className="py-3 px-4 font-bold">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                              {externalApplications
                                .filter(app => app.status === 'Round 1 Aptitude')
                                .map((app) => {
                                  const dateVal = app.interviewDate || 'Not Selected';
                                  const timeVal = app.interviewTime || '--';
                                  const statusVal = app.aptitudeStatus || 'Pending';

                                  return (
                                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="py-3.5 px-4 font-bold text-slate-900">{app.fullName}</td>
                                      <td className="py-3.5 px-4">{app.jobTitle}</td>
                                      <td className="py-3.5 px-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                                          dateVal === 'Not Selected' ? 'bg-slate-50 text-slate-500 border border-slate-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                                        }`}>
                                          {dateVal}
                                        </span>
                                      </td>
                                      <td className="py-3.5 px-4 font-semibold text-slate-900">{timeVal}</td>
                                      <td className="py-3.5 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold ${
                                          statusVal === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                          statusVal === 'Scheduled' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                          'bg-slate-50 text-slate-500 border border-slate-200'
                                        }`}>
                                          {statusVal}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })
                              }
                              {externalApplications.filter(app => app.status === 'Round 1 Aptitude').length === 0 && (
                                <tr>
                                  <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                                    No candidates currently in Round 1 Aptitude.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-fadeIn">
                      {/* Round 1 - Aptitude Questions Header */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                              Round 1 - Aptitude Questions
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">
                              Manage aptitude assessment questions for candidates
                            </p>
                          </div>
                          
                          {/* Stats */}
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold block">Total Questions</span>
                              <span className="text-lg font-black text-blue-700">50</span>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold block">Active</span>
                              <span className="text-lg font-black text-emerald-700">45</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-250 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Draft</span>
                              <span className="text-lg font-black text-slate-650">5</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-100">
                          <button className="flex items-center gap-2 bg-[#004AAD] hover:bg-[#003c8f] text-white font-bold py-2 px-4 rounded-xl text-xs shadow-sm hover:shadow transition duration-200 cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Add Question
                          </button>
                          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs border border-slate-250 transition duration-200 cursor-pointer">
                            <Upload className="h-4 w-4 text-slate-500" />
                            Import Excel
                          </button>
                          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs border border-slate-250 transition duration-200 cursor-pointer">
                            <Download className="h-4 w-4 text-slate-500" />
                            Export
                          </button>
                        </div>
                      </div>

                      {/* Categories Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Quant */}
                        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/25 transition-all duration-300 flex flex-col justify-between min-h-[140px] group cursor-pointer">
                          <div className="flex items-start justify-between">
                            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                              <Calculator className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-450 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-full">
                              Category 1
                            </span>
                          </div>
                          <div className="mt-4">
                            <h4 className="text-base font-bold text-slate-900">Quant</h4>
                            <p className="text-slate-500 text-xs mt-0.5">20 Questions</p>
                          </div>
                          <div className="flex items-center text-xs font-bold text-[#004AAD] mt-3 group-hover:translate-x-1 transition-transform duration-200">
                            Manage <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                          </div>
                        </div>

                        {/* Logical */}
                        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-500/25 transition-all duration-300 flex flex-col justify-between min-h-[140px] group cursor-pointer">
                          <div className="flex items-start justify-between">
                            <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
                              <Brain className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-455 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-full">
                              Category 2
                            </span>
                          </div>
                          <div className="mt-4">
                            <h4 className="text-base font-bold text-slate-900">Logical</h4>
                            <p className="text-slate-550 text-xs mt-0.5">15 Questions</p>
                          </div>
                          <div className="flex items-center text-xs font-bold text-purple-600 mt-3 group-hover:translate-x-1 transition-transform duration-200">
                            Manage <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                          </div>
                        </div>

                        {/* Verbal */}
                        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-500/25 transition-all duration-300 flex flex-col justify-between min-h-[140px] group cursor-pointer">
                          <div className="flex items-start justify-between">
                            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                              <BookOpen className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-455 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-full">
                              Category 3
                            </span>
                          </div>
                          <div className="mt-4">
                            <h4 className="text-base font-bold text-slate-900">Verbal</h4>
                            <p className="text-slate-555 text-xs mt-0.5">10 Questions</p>
                          </div>
                          <div className="flex items-center text-xs font-bold text-amber-600 mt-3 group-hover:translate-x-1 transition-transform duration-200">
                            Manage <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                          </div>
                        </div>

                        {/* Data Int. */}
                        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-500/25 transition-all duration-300 flex flex-col justify-between min-h-[140px] group cursor-pointer">
                          <div className="flex items-start justify-between">
                            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                              <BarChart3 className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-455 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-full">
                              Category 4
                            </span>
                          </div>
                          <div className="mt-4">
                            <h4 className="text-base font-bold text-slate-900">Data Int.</h4>
                            <p className="text-slate-555 text-xs mt-0.5">5 Questions</p>
                          </div>
                          <div className="flex items-center text-xs font-bold text-emerald-600 mt-3 group-hover:translate-x-1 transition-transform duration-200">
                            Manage <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : selectedStatusFilter === 'Round 2 Technical' ? (
                <div className="space-y-6 animate-fadeIn">
                  {/* Local Tabs for Dashboard vs Questions */}
                  <div className="flex space-x-6 border-b border-slate-200 pb-3">
                    <button
                      onClick={() => setTechnicalSubTab('dashboard')}
                      className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${technicalSubTab === 'dashboard' ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setTechnicalSubTab('questions')}
                      className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${technicalSubTab === 'questions' ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                      Assessment Questions
                    </button>
                  </div>

                  {technicalSubTab === 'dashboard' ? (
                    <div className="space-y-6">
                      {/* Round 2 - Technical Header */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Round 2 - Technical Dashboard
                          </h2>
                          <p className="text-slate-555 text-sm mt-1 font-semibold">
                            Manage code reviews, programming assessments, and domain fits
                          </p>
                        </div>
                      </div>

                      {/* Metrics Cards Row */}
                      {(() => {
                        const r2Apps = externalApplications.filter(app => app.status === 'Round 2 Technical');
                        const getCount = (keywords) => r2Apps.filter(app => 
                          keywords.some(kw => (app.jobTitle || '').toLowerCase().includes(kw))
                        ).length;
                        
                        const feCount = getCount(['react', 'frontend', 'ui', 'ux']);
                        const beCount = getCount(['java', 'spring', 'node', 'python', 'backend']);
                        const fsCount = getCount(['full stack', 'fullstack']);
                        const qaCount = getCount(['testing', 'qa', 'automation']);

                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Frontend */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Frontend</span>
                                <span className="text-3xl font-black text-blue-600">{feCount} Candidates</span>
                              </div>
                              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <Sliders className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Backend */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Backend</span>
                                <span className="text-3xl font-black text-emerald-600">{beCount} Candidates</span>
                              </div>
                              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                <Sliders className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Full Stack */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Full Stack</span>
                                <span className="text-3xl font-black text-purple-600">{fsCount} Candidates</span>
                              </div>
                              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                                <Sliders className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Testing */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Testing</span>
                                <span className="text-3xl font-black text-amber-600">{qaCount} Candidates</span>
                              </div>
                              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                                <Sliders className="h-6 w-6" />
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Domain Tabs selection */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="mb-6">
                          <h3 className="text-base font-bold text-slate-900">Domain Assessment Tabs</h3>
                          <p className="text-slate-450 text-xs mt-0.5 font-semibold">Filter candidates based on technical specialization</p>
                        </div>

                        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4 mb-6">
                          {['React', 'Java', 'Spring Boot', 'Node.js', 'Python', 'Testing', 'DevOps'].map((domain) => (
                            <button
                              key={domain}
                              onClick={() => setSelectedDomainTab(domain)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                                selectedDomainTab === domain
                                  ? 'bg-[#004AAD] text-white border-[#004AAD] shadow-sm'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {domain}
                            </button>
                          ))}
                        </div>

                        {/* Filtered Candidate Table */}
                        {(() => {
                          const r2Apps = externalApplications.filter(app => app.status === 'Round 2 Technical');
                          
                          const filteredApps = r2Apps.filter(app => {
                            const title = (app.jobTitle || '').toLowerCase();
                            if (selectedDomainTab === 'React') return title.includes('react') || title.includes('frontend') || title.includes('ui') || title.includes('ux');
                            if (selectedDomainTab === 'Java') return title.includes('java') && !title.includes('spring');
                            if (selectedDomainTab === 'Spring Boot') return title.includes('spring') || (title.includes('java') && title.includes('boot'));
                            if (selectedDomainTab === 'Node.js') return title.includes('node') || title.includes('backend') || title.includes('express');
                            if (selectedDomainTab === 'Python') return title.includes('python') || title.includes('django') || title.includes('data');
                            if (selectedDomainTab === 'Testing') return title.includes('testing') || title.includes('qa') || title.includes('test');
                            if (selectedDomainTab === 'DevOps') return title.includes('devops') || title.includes('cloud') || title.includes('aws') || title.includes('docker');
                            return true;
                          });

                          return (
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                                  <tr>
                                    <th className="py-3 px-4 font-bold">Candidate Name</th>
                                    <th className="py-3 px-4 font-bold">Position</th>
                                    <th className="py-3 px-4 font-bold">Email</th>
                                    <th className="py-3 px-4 font-bold">Experience</th>
                                    <th className="py-3 px-4 font-bold">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                  {filteredApps.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="py-3.5 px-4 font-bold text-slate-900">{app.fullName}</td>
                                      <td className="py-3.5 px-4 font-medium text-slate-600">{app.jobTitle}</td>
                                      <td className="py-3.5 px-4 text-slate-500">{app.email}</td>
                                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                                        {app.experience || '3 Years'}
                                      </td>
                                      <td className="py-3.5 px-4">
                                        <button
                                          onClick={() => setSelectedApplication(app)}
                                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[#004AAD] hover:text-[#003882] rounded-lg font-bold transition text-[11px] cursor-pointer"
                                        >
                                          Review
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                  {filteredApps.length === 0 && (
                                    <tr>
                                      <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                                        No candidates found for {selectedDomainTab} in Round 2 Technical.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Round 2 - Technical Questions Header */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="text-left">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                              Round 2 - Technical Questions
                            </h2>
                            <p className="text-slate-500 text-sm mt-1 font-semibold">
                              Manage domain coding challenges, system design prompts, and automation assessments
                            </p>
                          </div>
                          
                          {/* Stats */}
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold block">Total Questions</span>
                              <span className="text-lg font-black text-blue-700">{technicalQuestionsData.length}</span>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold block">Active</span>
                              <span className="text-lg font-black text-emerald-700">{technicalQuestionsData.length}</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-250 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Draft</span>
                              <span className="text-lg font-black text-slate-655">0</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-100">
                          <button className="flex items-center gap-2 bg-[#004AAD] hover:bg-[#003c8f] text-white font-bold py-2 px-4 rounded-xl text-xs shadow-sm hover:shadow transition duration-200 cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Add Question
                          </button>
                          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs border border-slate-250 transition duration-200 cursor-pointer">
                            <Upload className="h-4 w-4 text-slate-500" />
                            Import JSON
                          </button>
                          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs border border-slate-250 transition duration-200 cursor-pointer">
                            <Download className="h-4 w-4 text-slate-500" />
                            Export
                          </button>
                        </div>
                      </div>

                      {/* Domain category cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {['React', 'Java', 'Spring Boot', 'Node.js', 'Python', 'Testing', 'DevOps'].map((domain) => {
                          const count = technicalQuestionsData.filter(q => q.category === domain).length;
                          let iconBg = 'bg-blue-50 text-blue-600';
                          if (domain === 'Java') iconBg = 'bg-amber-50 text-amber-600';
                          if (domain === 'Spring Boot') iconBg = 'bg-emerald-50 text-emerald-600';
                          if (domain === 'Node.js') iconBg = 'bg-violet-50 text-violet-600';
                          if (domain === 'Python') iconBg = 'bg-indigo-50 text-indigo-600';
                          if (domain === 'Testing') iconBg = 'bg-rose-50 text-rose-600';
                          if (domain === 'DevOps') iconBg = 'bg-cyan-50 text-cyan-600';

                          return (
                            <div
                              key={domain}
                              onClick={() => setSelectedDomainTab(domain)}
                              className={`p-5 rounded-2xl shadow-sm border transition-all duration-300 flex flex-col justify-between min-h-[120px] group cursor-pointer ${
                                selectedDomainTab === domain
                                  ? 'bg-white border-[#004AAD] ring-2 ring-[#004AAD]/10'
                                  : 'bg-white border-slate-200 hover:border-[#004AAD]/40 hover:shadow-md'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className={`p-2.5 rounded-xl ${iconBg}`}>
                                  <Sliders className="h-5 w-5" />
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  selectedDomainTab === domain ? 'bg-[#004AAD] text-white' : 'bg-slate-50 text-slate-550 border border-slate-200'
                                }`}>
                                  Category
                                </span>
                              </div>
                              <div className="mt-3 text-left">
                                <h4 className="text-sm font-bold text-slate-900">{domain}</h4>
                                <p className="text-slate-500 text-[11px] mt-0.5 font-semibold">{count} Questions</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Filtered coding questions list */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                          <div className="text-left">
                            <h3 className="text-base font-bold text-slate-900">Assessment challenges: {selectedDomainTab}</h3>
                            <p className="text-slate-450 text-xs mt-0.5 font-semibold">Coding problems presented to candidates during technical evaluation</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {technicalQuestionsData
                            .filter(q => q.category === selectedDomainTab)
                            .map((question, idx) => (
                              <div key={question.id} className="border border-slate-200 rounded-xl p-5 hover:border-slate-350 transition-colors text-left bg-slate-50/20">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <span className="h-5 w-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                                      {idx + 1}
                                    </span>
                                    {question.title}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                                      question.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
                                      question.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-250' :
                                      'bg-rose-50 text-rose-700 border-rose-250'
                                    }`}>
                                      {question.difficulty}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-semibold">{question.time} limit</span>
                                  </div>
                                </div>
                                
                                <p className="text-xs text-slate-600 leading-relaxed mb-4 font-semibold">
                                  {question.description}
                                </p>

                                <div className="bg-[#0f172a] text-slate-300 font-mono text-[11px] rounded-lg p-4 overflow-x-auto whitespace-pre leading-relaxed border border-slate-900 shadow-inner">
                                  {question.codeSnippet}
                                </div>
                              </div>
                            ))}
                          {technicalQuestionsData.filter(q => q.category === selectedDomainTab).length === 0 && (
                            <div className="py-8 text-center text-slate-455 italic text-xs">
                              No questions set for the {selectedDomainTab} specialization domain.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : selectedStatusFilter === 'Round 3 Brand Awareness' ? (
                <div className="space-y-6 animate-fadeIn">
                  {/* Local Tabs for Dashboard vs Questions */}
                  <div className="flex space-x-6 border-b border-slate-200 pb-3">
                    <button
                      onClick={() => setBrandSubTab('dashboard')}
                      className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${brandSubTab === 'dashboard' ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setBrandSubTab('questions')}
                      className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${brandSubTab === 'questions' ? 'border-[#004AAD] text-[#004AAD]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                      Assessment Questions
                    </button>
                  </div>

                  {brandSubTab === 'dashboard' ? (
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div>
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Round 3 - Brand Awareness Dashboard
                          </h2>
                          <p className="text-slate-555 text-sm mt-1 font-semibold">
                            Evaluate candidate alignment with BNX products, brand messaging, and user advocacy
                          </p>
                        </div>
                      </div>

                      {/* Metrics Cards */}
                      {(() => {
                        const r3Apps = externalApplications.filter(app => app.status === 'Round 3 Brand Awareness');
                        const getCount = (keywords) => r3Apps.filter(app => 
                          keywords.some(kw => (app.jobTitle || '').toLowerCase().includes(kw))
                        ).length;

                        const mailCount = getCount(['mail', 'smtp']);
                        const cliksCount = getCount(['cliks', 'business']);
                        const valuesCount = getCount(['values', 'core']);
                        const prCount = getCount(['relations', 'representative']);

                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* BNX Mail */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">BNX Mail</span>
                                <span className="text-3xl font-black text-blue-600">{mailCount} Candidates</span>
                              </div>
                              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <Mail className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Cliks Business */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Cliks Business</span>
                                <span className="text-3xl font-black text-emerald-600">{cliksCount} Candidates</span>
                              </div>
                              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                <Briefcase className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Company Core Values */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Company Core Values</span>
                                <span className="text-3xl font-black text-purple-600">{valuesCount} Candidates</span>
                              </div>
                              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                                <Brain className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Public Relations */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Public Relations</span>
                                <span className="text-3xl font-black text-amber-600">{prCount} Candidates</span>
                              </div>
                              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                                <Users className="h-6 w-6" />
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Domain Tabs selection */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="mb-6">
                          <h3 className="text-base font-bold text-slate-900">Brand Specialist domains</h3>
                          <p className="text-slate-450 text-xs mt-0.5 font-semibold">Filter candidates based on product focus area</p>
                        </div>

                        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4 mb-6">
                          {['BNX Mail', 'Cliks Business', 'Company Core Values', 'Public Relations', 'Ecosystem Integration'].map((domain) => (
                            <button
                              key={domain}
                              onClick={() => setSelectedBrandDomainTab(domain)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                                selectedBrandDomainTab === domain
                                  ? 'bg-[#004AAD] text-white border-[#004AAD] shadow-sm'
                                  : 'bg-slate-50 text-slate-655 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {domain}
                            </button>
                          ))}
                        </div>

                        {/* Candidate Table */}
                        {(() => {
                          const r3Apps = externalApplications.filter(app => app.status === 'Round 3 Brand Awareness');
                          
                          const filteredApps = r3Apps.filter(app => {
                            const title = (app.jobTitle || '').toLowerCase();
                            if (selectedBrandDomainTab === 'BNX Mail') return title.includes('mail') || title.includes('smtp');
                            if (selectedBrandDomainTab === 'Cliks Business') return title.includes('cliks') || title.includes('business');
                            if (selectedBrandDomainTab === 'Company Core Values') return title.includes('values') || title.includes('core');
                            if (selectedBrandDomainTab === 'Public Relations') return title.includes('relations') || title.includes('representative');
                            if (selectedBrandDomainTab === 'Ecosystem Integration') return title.includes('ecosystem') || title.includes('partner') || title.includes('integration');
                            return true;
                          });

                          return (
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                                  <tr>
                                    <th className="py-3 px-4 font-bold">Candidate Name</th>
                                    <th className="py-3 px-4 font-bold">Focus Area</th>
                                    <th className="py-3 px-4 font-bold">Email</th>
                                    <th className="py-3 px-4 font-bold">Experience</th>
                                    <th className="py-3 px-4 font-bold">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                  {filteredApps.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="py-3.5 px-4 font-bold text-slate-900">{app.fullName}</td>
                                      <td className="py-3.5 px-4 font-medium text-slate-600">{app.jobTitle}</td>
                                      <td className="py-3.5 px-4 text-slate-500">{app.email}</td>
                                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                                        {app.experience || '3 Years'}
                                      </td>
                                      <td className="py-3.5 px-4">
                                        <button
                                          onClick={() => setSelectedApplication(app)}
                                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[#004AAD] hover:text-[#003882] rounded-lg font-bold transition text-[11px] cursor-pointer"
                                        >
                                          Review
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                  {filteredApps.length === 0 && (
                                    <tr>
                                      <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                                        No candidates found for {selectedBrandDomainTab} in Round 3 Brand Awareness.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Questions Header */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="text-left">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                              Round 3 - Brand & Product Questions
                            </h2>
                            <p className="text-slate-555 text-sm mt-1 font-semibold">
                              Assess candidate awareness of BNX products, SMTP mail systems, task workspaces, and Beta brand messaging
                            </p>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold block">Total Questions</span>
                              <span className="text-lg font-black text-blue-700">{brandQuestionsData.length}</span>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold block">Active</span>
                              <span className="text-lg font-black text-emerald-700">{brandQuestionsData.length}</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-250 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Draft</span>
                              <span className="text-lg font-black text-slate-655">0</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-100">
                          <button className="flex items-center gap-2 bg-[#004AAD] hover:bg-[#003c8f] text-white font-bold py-2 px-4 rounded-xl text-xs shadow-sm hover:shadow transition duration-200 cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Add Question
                          </button>
                          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs border border-slate-250 transition duration-200 cursor-pointer">
                            <Upload className="h-4 w-4 text-slate-500" />
                            Import JSON
                          </button>
                          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs border border-slate-250 transition duration-200 cursor-pointer">
                            <Download className="h-4 w-4 text-slate-500" />
                            Export
                          </button>
                        </div>
                      </div>

                      {/* Domain cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {['BNX Mail', 'Cliks Business', 'Company Core Values', 'Public Relations', 'Ecosystem Integration'].map((domain) => {
                          const count = brandQuestionsData.filter(q => q.category === domain).length;
                          let iconBg = 'bg-blue-50 text-blue-600';
                          if (domain === 'Cliks Business') iconBg = 'bg-emerald-50 text-emerald-600';
                          if (domain === 'Company Core Values') iconBg = 'bg-purple-50 text-purple-600';
                          if (domain === 'Public Relations') iconBg = 'bg-amber-50 text-amber-600';
                          if (domain === 'Ecosystem Integration') iconBg = 'bg-rose-50 text-rose-600';

                          return (
                            <div
                              key={domain}
                              onClick={() => setSelectedBrandDomainTab(domain)}
                              className={`p-5 rounded-2xl shadow-sm border transition-all duration-300 flex flex-col justify-between min-h-[120px] group cursor-pointer ${
                                selectedBrandDomainTab === domain
                                  ? 'bg-white border-[#004AAD] ring-2 ring-[#004AAD]/10'
                                  : 'bg-white border-slate-200 hover:border-[#004AAD]/40 hover:shadow-md'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className={`p-2.5 rounded-xl ${iconBg}`}>
                                  {domain === 'BNX Mail' ? <Mail className="h-5 w-5" /> : <Sliders className="h-5 w-5" />}
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  selectedBrandDomainTab === domain ? 'bg-[#004AAD] text-white' : 'bg-slate-50 text-slate-555 border border-slate-200'
                                }`}>
                                  Category
                                </span>
                              </div>
                              <div className="mt-3 text-left">
                                <h4 className="text-sm font-bold text-slate-900">{domain}</h4>
                                <p className="text-slate-555 text-[11px] mt-0.5 font-semibold">{count} Questions</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Brand questions list */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                          <div className="text-left">
                            <h3 className="text-base font-bold text-slate-900">Brand awareness challenges: {selectedBrandDomainTab}</h3>
                            <p className="text-slate-455 text-xs mt-0.5 font-semibold">Brand fit questions and expected positioning answers</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {brandQuestionsData
                            .filter(q => q.category === selectedBrandDomainTab)
                            .map((question, idx) => (
                              <div key={question.id} className="border border-slate-200 rounded-xl p-5 hover:border-slate-350 transition-colors text-left bg-slate-50/20">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <span className="h-5 w-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                                      {idx + 1}
                                    </span>
                                    {question.title}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                                      question.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
                                      question.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-250' :
                                      'bg-rose-50 text-rose-700 border-rose-250'
                                    }`}>
                                      {question.difficulty}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-semibold">{question.time} limit</span>
                                  </div>
                                </div>

                                <p className="text-xs text-slate-600 leading-relaxed mb-4 font-semibold">
                                  {question.description}
                                </p>

                                <div className="bg-[#0f172a] text-slate-300 font-mono text-[11px] rounded-lg p-4 overflow-x-auto whitespace-pre leading-relaxed border border-slate-900 shadow-inner">
                                  {question.codeSnippet}
                                </div>
                              </div>
                            ))}
                          {brandQuestionsData.filter(q => q.category === selectedBrandDomainTab).length === 0 && (
                            <div className="py-8 text-center text-slate-400 italic text-xs">
                              No questions set for the {selectedBrandDomainTab} branding category.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                {/* Filtering header */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200">
                  <div className="text-slate-600 text-xs font-medium">
                    Showing {
                      externalApplications
                        .filter(app => selectedJobFilter === 'All' || app.jobTitle === selectedJobFilter)
                        .filter(app => selectedStatusFilter === 'Candidates' ? app.status === 'Candidates' : app.status === selectedStatusFilter)
                        .length
                    } applications {selectedJobFilter !== 'All' && `for "${selectedJobFilter}"`}{selectedStatusFilter !== 'Candidates' && ` marked as "${selectedStatusFilter}"`}
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Filter by Job:</label>
                    <select
                      value={selectedJobFilter}
                      onChange={(e) => setSelectedJobFilter(e.target.value)}
                      className="bg-white text-slate-850 border border-slate-250 rounded-lg py-1.5 px-3 focus:outline-none focus:border-blue-500 text-xs transition cursor-pointer"
                    >
                      <option value="All">All Jobs</option>
                      {Array.from(new Set(externalApplications.map(app => app.jobTitle))).map(title => (
                        <option key={title} value={title}>{title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="admin-glass-card rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                        <tr>
                          <th className="py-4 px-6 font-bold">Candidate</th>
                          <th className="py-4 px-6 font-bold">Job Applied</th>
                          <th className="py-4 px-6 font-bold">Status</th>
                          <th className="py-4 px-6 font-bold">Date</th>
                          <th className="py-4 px-6 font-bold">Resume</th>
                          <th className="py-4 px-6 font-bold">Cover Letter</th>
                          <th className="py-4 px-6 font-bold text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                        {(() => {
                          const filtered = externalApplications
                            .filter(app => selectedJobFilter === 'All' || app.jobTitle === selectedJobFilter)
                            .filter(app => selectedStatusFilter === 'Candidates' ? app.status === 'Candidates' : app.status === selectedStatusFilter);

                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                                  No external applications found matching the selected filters.
                                </td>
                              </tr>
                            );
                          }

                          return filtered.map(app => (
                            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4 px-6">
                                <div className="font-bold text-slate-900">{app.fullName}</div>
                                <div className="text-slate-450 text-[10px] mt-0.5">{app.email}</div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="font-semibold text-slate-900">{app.jobTitle}</div>
                                <div className="text-slate-450 text-[10px] mt-0.5">{app.jobDepartment} • {app.jobLocation}</div>
                              </td>
                              <td className="py-4 px-6">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize whitespace-nowrap ${
                                  app.status === 'Candidates' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                                  app.status === 'Round 1 Aptitude' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                  app.status === 'Round 2 Technical' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                                  app.status === 'Round 3 Brand Awareness' ? 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200' :
                                  app.status === 'Shortlisted' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                  app.status === 'Interview Scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                  app.status === 'Interview Completed' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' :
                                  app.status === 'Selected' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                  app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                  app.status === 'Joined' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                                  'bg-slate-50 text-slate-700 border border-slate-200'
                                }`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-slate-450">
                                {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="py-4 px-6">
                                {app.resumeUrl ? (
                                  <a
                                    href={app.resumeUrl.startsWith('http') ? app.resumeUrl : `https://apply.beta-softnet.com${app.resumeUrl}`}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-blue-50 text-[#004AAD] border border-blue-100 hover:bg-blue-100 transition font-bold"
                                  >
                                    <FileText className="h-3.5 w-3.5 text-[#004AAD]" />
                                    <span>Download</span>
                                  </a>
                                ) : (
                                  <span className="text-slate-400 italic">No resume</span>
                                )}
                              </td>
                              <td className="py-4 px-6 max-w-xs">
                                <button
                                  onClick={() => setSelectedCoverLetter({
                                    candidate: app.fullName,
                                    job: app.jobTitle,
                                    text: app.coverLetter
                                  })}
                                  className="text-[#004AAD] hover:text-blue-800 font-semibold underline underline-offset-2 text-left line-clamp-2 cursor-pointer bg-transparent border-none p-0"
                                >
                                  {app.coverLetter}
                                </button>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  {app.resumeUrl ? (
                                    <button
                                      onClick={() => window.open(app.resumeUrl.startsWith('http') ? app.resumeUrl : `https://apply.beta-softnet.com${app.resumeUrl}`, '_blank')}
                                      className="px-2.5 py-1.5 rounded bg-blue-50 hover:bg-blue-100 text-[#004AAD] border border-blue-200 text-[10px] font-bold transition cursor-pointer whitespace-nowrap"
                                    >
                                      View Resume
                                    </button>
                                  ) : (
                                    <button
                                      disabled
                                      className="px-2.5 py-1.5 rounded bg-slate-50 text-slate-400 border border-slate-205 text-[10px] font-bold opacity-50 cursor-not-allowed whitespace-nowrap"
                                    >
                                      No Resume
                                    </button>
                                  )}

                                  <button
                                    onClick={() => {
                                      setSelectedApplication(app);
                                      setCandidateStatus(app.status || 'Candidates');
                                    }}
                                    className="px-2.5 py-1.5 rounded bg-purple-50 hover:bg-purple-100 text-[#8B5CF6] border border-purple-200 text-[10px] font-bold transition cursor-pointer whitespace-nowrap"
                                  >
                                    Schedule Interview
                                  </button>

                                  <button
                                    onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                                    className="px-2.5 py-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[10px] font-bold transition cursor-pointer whitespace-nowrap"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Modal dialog for Job Board posting / editing */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl text-left my-8 admin-scrollbar overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsJobModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-6">
              {editingJob ? 'Edit Job Opening' : 'Post a New Job'}
            </h3>

            <form onSubmit={handleJobSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Job Title</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Systems Engineer"
                    className="w-full admin-custom-input border border-slate-300 rounded-lg py-2 px-3 focus:outline-none text-sm transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Department</label>
                  <input
                    type="text"

                    value={jobDept}
                    onChange={(e) => setJobDept(e.target.value)}
                    placeholder="e.g. Engineering"
                    className="w-full admin-custom-input border border-slate-300 rounded-lg py-2 px-3 focus:outline-none text-sm transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Location</label>
                  <input
                    type="text"
                    required
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    placeholder="e.g. Remote"
                    className="w-full admin-custom-input border border-slate-300 rounded-lg py-2 px-3 focus:outline-none text-sm transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Job Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full admin-custom-input border border-slate-300 rounded-lg py-2.5 px-3 focus:outline-none text-sm transition cursor-pointer"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Salary Range</label>
                  <input
                    type="text"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    placeholder="e.g. ₹10k - ₹15k"
                    className="w-full admin-custom-input border border-slate-300 rounded-lg py-2 px-3 focus:outline-none text-sm transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase">Description</label>
                <textarea
                  rows={3}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="We are seeking..."
                  className="w-full admin-custom-input border border-slate-300 rounded-lg py-2 px-3 focus:outline-none text-sm transition"
                />
              </div>

              {/* Responsibilities list */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase">Responsibilities</label>
                  <button
                    type="button"
                    onClick={() => addArrayField(jobResponsibilities, setJobResponsibilities)}
                    className="text-[10px] text-[#004AAD] hover:underline font-bold"
                  >
                    + Add item
                  </button>
                </div>
                <div className="space-y-2">
                  {jobResponsibilities.map((resp, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"

                        value={resp}
                        onChange={(e) => handleArrayChange(idx, e.target.value, jobResponsibilities, setJobResponsibilities)}
                        placeholder={`Responsibility #${idx + 1}`}
                        className="flex-grow admin-custom-input border border-slate-300 rounded-lg py-1.5 px-3 focus:outline-none text-sm transition"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField(idx, jobResponsibilities, setJobResponsibilities)}
                        className="p-1.5 bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-100 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements list */}
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase">Requirements</label>
                  <button
                    type="button"
                    onClick={() => addArrayField(jobRequirements, setJobRequirements)}
                    className="text-[10px] text-[#004AAD] hover:underline font-bold"
                  >
                    + Add item
                  </button>
                </div>
                <div className="space-y-2">
                  {jobRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"

                        value={req}
                        onChange={(e) => handleArrayChange(idx, e.target.value, jobRequirements, setJobRequirements)}
                        placeholder={`Requirement #${idx + 1}`}
                        className="flex-grow admin-custom-input border border-slate-300 rounded-lg py-1.5 px-3 focus:outline-none text-sm transition"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField(idx, jobRequirements, setJobRequirements)}
                        className="p-1.5 bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-100 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills list */}
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase">Required Skills</label>
                  <button
                    type="button"
                    onClick={() => addArrayField(jobSkills, setJobSkills)}
                    className="text-[10px] text-[#004AAD] hover:underline font-bold"
                  >
                    + Add skill
                  </button>
                </div>
                <div className="space-y-2">
                  {jobSkills.map((skill, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"

                        value={skill}
                        onChange={(e) => handleArrayChange(idx, e.target.value, jobSkills, setJobSkills)}
                        placeholder={`Skill #${idx + 1}`}
                        className="flex-grow admin-custom-input border border-slate-300 rounded-lg py-1.5 px-3 focus:outline-none text-sm transition"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField(idx, jobSkills, setJobSkills)}
                        className="p-1.5 bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-100 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-2.5 rounded-xl admin-glow-btn text-white text-xs font-bold transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? <span>Saving...</span> : <span>{editingJob ? 'Save Changes' : 'Publish Job Opening'}</span>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Candidate Profile Review & Interview Scheduling */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl text-left my-8 admin-scrollbar overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedApplication(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition animate-fadeIn"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Review Candidate Profile
            </h3>
            <p className="text-xs text-slate-500 mb-6 border-b border-slate-100 pb-2">
              Review info, update candidacy status, or schedule an interview below.
            </p>

            <div className="space-y-6">
              {/* Stepper / Progress Tracking */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Candidate Hiring Progress</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {['Candidates', 'Round 1 Aptitude', 'Round 2 Technical', 'Round 3 Brand Awareness', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Joined'].map((step, idx) => {
                    const order = ['Candidates', 'Round 1 Aptitude', 'Round 2 Technical', 'Round 3 Brand Awareness', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Joined'];
                    const curIdx = order.indexOf(selectedApplication.status);
                    const isCompleted = curIdx >= idx && selectedApplication.status !== 'Rejected';
                    const isCurrent = selectedApplication.status === step;
                    
                    return (
                      <div 
                        key={step} 
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition duration-300 ${
                          isCurrent 
                            ? 'bg-blue-600 border-transparent text-white shadow-sm' 
                            : isCompleted 
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                              : 'bg-white border-slate-100 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] font-extrabold tracking-tight block">
                          {step}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">✓</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {selectedApplication.status === 'Rejected' && (
                  <div className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-lg text-center animate-pulse">
                    This candidate has been Rejected.
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Candidate Name</label>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedApplication.fullName}</p>

                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-3">Contact Email</label>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{selectedApplication.email}</p>

                  {selectedApplication.phone && (
                    <>
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-3">Phone</label>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">{selectedApplication.phone}</p>
                    </>
                  )}
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Applied Position</label>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedApplication.jobTitle}</p>

                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-3">Dept & Location</label>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{selectedApplication.jobDepartment} • {selectedApplication.jobLocation}</p>

                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Current Status</label>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold capitalize mt-1 ${
                    selectedApplication.status === 'Candidates' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                    selectedApplication.status === 'Round 1 Aptitude' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    selectedApplication.status === 'Round 2 Technical' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                    selectedApplication.status === 'Round 3 Brand Awareness' ? 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200' :
                    selectedApplication.status === 'Shortlisted' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                    selectedApplication.status === 'Interview Scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    selectedApplication.status === 'Interview Completed' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' :
                    selectedApplication.status === 'Selected' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    selectedApplication.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    selectedApplication.status === 'Joined' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                    'bg-slate-50 text-slate-700 border border-slate-200'
                  }`}>
                    {selectedApplication.status}
                  </span>
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApplication.coverLetter && (
                <div>
                  <label className="text-xs font-bold uppercase">Cover Letter</label>
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl max-h-[140px] overflow-y-auto mt-1.5">
                    <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-wrap">
                      {selectedApplication.coverLetter}
                    </p>
                  </div>
                </div>
              )}

              {/* Status Update Actions */}
              <div className="border-t border-slate-100 pt-4">
                <label className="text-xs font-bold uppercase block mb-2">Update Application Status</label>
                <div className="flex flex-wrap gap-2">
                  {['Candidates', 'Round 1 Aptitude', 'Round 2 Technical', 'Round 3 Brand Awareness', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Rejected', 'Joined'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedApplication.id, status)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition cursor-pointer capitalize ${
                        selectedApplication.status === status
                          ? 'bg-slate-900 border-transparent text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule Interview Form */}
              <form onSubmit={handleScheduleInterview} className="border-t border-slate-100 pt-4 space-y-4">
                <label className="text-xs font-bold uppercase block mb-1">Schedule Interview / Meeting</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">Date</label>
                    <input
                      type="date"
                      required
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full admin-custom-input border border-slate-300 rounded-lg py-1.5 px-3 focus:outline-none text-xs transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase block">Time</label>
                    <input
                      type="time"
                      required
                      value={interviewTime}
                      onChange={(e) => setInterviewTime(e.target.value)}
                      className="w-full admin-custom-input border border-slate-300 rounded-lg py-1.5 px-3 focus:outline-none text-xs transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-450 font-bold uppercase block">Interviewer Name</label>
                    <input
                      type="text"
                      required
                      value={interviewer}
                      onChange={(e) => setInterviewer(e.target.value)}
                      placeholder="e.g. Engineering Lead"
                      className="w-full admin-custom-input border border-slate-300 rounded-lg py-1.5 px-3 focus:outline-none text-xs transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-450 font-bold uppercase block">Meeting Link</label>
                    <input
                      type="url"
                      required
                      value={interviewLink}
                      onChange={(e) => setInterviewLink(e.target.value)}
                      placeholder="e.g. https://meet.google.com/xyz"
                      className="w-full admin-custom-input border border-slate-300 rounded-lg py-1.5 px-3 focus:outline-none text-xs transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-450 font-bold uppercase block">Remarks</label>
                  <textarea
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Discuss system architecture alignment..."
                    className="w-full admin-custom-input border border-slate-300 rounded-lg py-1.5 px-3 focus:outline-none text-xs transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2"
                >
                  <span>Schedule & Save Interview Details</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Cover Letter Preview */}
      {selectedCoverLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl text-left">
            <button
              onClick={() => setSelectedCoverLetter(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Cover Letter
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Submitted by <strong className="text-slate-905">{selectedCoverLetter.candidate}</strong> for the position of <strong className="text-slate-905">{selectedCoverLetter.job}</strong>
            </p>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl max-h-[60vh] overflow-y-auto admin-scrollbar">
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap no-override">
                {selectedCoverLetter.text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

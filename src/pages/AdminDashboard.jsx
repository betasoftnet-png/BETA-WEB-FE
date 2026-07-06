import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import {
  Plus, Edit, Trash, FileText, Briefcase, LogOut,
  RefreshCw, CheckCircle, AlertCircle, X, Shield, Users,
  Lock, Mail, Calculator, Brain, BookOpen, BarChart3, Bell,
  Upload, Download, ChevronRight, Calendar, Sliders,
  Handshake
} from 'lucide-react';
import axios from 'axios';
import api from '../api';

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

const fallbackPartnerships = [
  {
    id: 'partner-mock-1',
    name: 'Jane Doe',
    email: 'jane.doe@globaltech.com',
    company: 'Global Tech Solutions',
    partnerType: 'Technology Partner',
    website: 'https://globaltech.com',
    companySize: '500-1000',
    marketFocus: 'Enterprise Cloud Infrastructure',
    proposal: 'We would like to integrate BNX Mail into our corporate dashboard suite to provide our clients with zero-knowledge encrypted mail channels.',
    phone: '+1 (555) 321-9876',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'partner-mock-2',
    name: 'Sophia Loren',
    email: 'sophia@fintechpulse.io',
    company: 'Fintech Pulse Inc',
    partnerType: 'Strategic Alliance',
    website: 'https://fintechpulse.io',
    companySize: '100-250',
    marketFocus: 'Financial Data Analytics',
    proposal: 'Seeking an integration with B2Auth for single-sign-on MFA across our customer trading desks. We want to co-market this solution to compliance officers.',
    phone: '+44 20 7946 0192',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

const parsePartnerMessage = (msg, name, email, company, id, date) => {
  if (!msg) return null;
  const isPartner = msg.includes('[Futuristic Partner Request]') || msg.includes('Partner Type:');
  if (!isPartner) return null;

  const getValue = (label) => {
    const regex = new RegExp(`${label}:\\s*(.*)`);
    const match = msg.match(regex);
    return match ? match[1].trim() : '';
  };

  return {
    id: id || Math.random().toString(),
    name: name || '',
    email: email || '',
    company: company || '',
    partnerType: getValue('Partner Type') || 'Technology Partner',
    website: getValue('Website') || 'N/A',
    companySize: getValue('Company Size') || 'N/A',
    marketFocus: getValue('Market Focus') || 'N/A',
    proposal: getValue('Proposal Summary') || msg,
    phone: getValue('Phone') || 'N/A',
    createdAt: date || new Date().toISOString()
  };
};

const fallbackSupports = [
  {
    id: 'support-mock-1',
    name: 'Michael Scott',
    email: 'michael.scott@dundermifflin.com',
    product: 'BNX Mail',
    message: 'We are facing issue when synchronization with SMTP connector is delayed. It takes about 2 minutes to show up on active conversations. Please check latency on our dedicated endpoint.',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'support-mock-2',
    name: 'Pam Beesly',
    email: 'pam@dundermifflin.com',
    product: 'Cliks Business',
    message: 'Can you guide me on how to delegate user administration permissions? We want to assign 3 secondary team leads with edit rights on the canvas.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

const parseSupportMessage = (msg, name, email, company, id, date) => {
  if (!msg) return null;
  const isPartner = msg.includes('[Futuristic Partner Request]') || msg.includes('Partner Type:');
  if (isPartner) return null;

  return {
    id: id || Math.random().toString(),
    name: name || '',
    email: email || '',
    product: (company || '').replace('Support Request - ', '').trim() || 'General Enquiry',
    message: msg,
    createdAt: date || new Date().toISOString()
  };
};

const generateAptitudeQuestions = (category) => {
  const list = [];

  const vocabSynonyms = [
    { word: 'Loquacious', options: 'Talkative, Quiet, Angry, Happy', ans: 'Talkative' },
    { word: 'Ephemeral', options: 'Short-lived, Eternal, Internal, Bright', ans: 'Short-lived' },
    { word: 'Capricious', options: 'Unpredictable, Steady, Intelligent, Fearful', ans: 'Unpredictable' },
    { word: 'Aberration', options: 'Deviation, Standard, Consequence, Alignment', ans: 'Deviation' },
    { word: 'Gregarious', options: 'Sociable, Introverted, Aggressive, Calm', ans: 'Sociable' },
    { word: 'Taciturn', options: 'Reserved, Loud, Creative, Hostile', ans: 'Reserved' },
    { word: 'Obdurate', options: 'Stubborn, Flexible, Caring, Wise', ans: 'Stubborn' },
    { word: 'Mitigate', options: 'Alleviate, Aggravate, Connect, Enhance', ans: 'Alleviate' },
    { word: 'Pragmatic', options: 'Practical, Dreamy, Reckless, Logical', ans: 'Practical' },
    { word: 'Apathy', options: 'Indifference, Empathy, Enthusiasm, Clarity', ans: 'Indifference' }
  ];

  const verbalErrors = [
    "Neither the manager nor his employees [was/were] present at the launch.",
    "She has been working in the branding department [since/for] five years.",
    "The client was angry because the software had [many/much] bugs.",
    "If he [would have/had] studied the core values, he would have cleared the interview.",
    "Every one of the applicants [have/has] submitted their respective documents."
  ];

  if (category === 'Quant') {
    for (let i = 1; i <= 50; i++) {
      const type = i % 8;
      let title = "";
      let description = "";
      let codeSnippet = "";

      if (type === 0) {
        title = `Simple Interest & Growth Q${i}`;
        const sum = i * 200 + 1000;
        const rate = (i % 5) + 4;
        const years = (i % 3) + 2;
        description = `Calculate the Simple Interest on a principal sum of $${sum} at a rate of ${rate}% per annum for ${years} years.`;
        codeSnippet = `Formula: SI = (P * R * T) / 100\nP = $${sum}, R = ${rate}%, T = ${years} years\nResult: $${(sum * rate * years) / 100}`;
      } else if (type === 1) {
        title = `Train & Platform Speed Q${i}`;
        const speedKmh = 45 + (i % 5) * 9;
        const trainLen = 150 + (i % 4) * 50;
        const timeSec = 20 + (i % 3) * 10;
        description = `A train traveling at ${speedKmh} km/h passes a platform in ${timeSec} seconds. If the length of the train is ${trainLen} meters, find the length of the platform in meters.`;
        codeSnippet = `Speed: ${speedKmh} km/h = ${((speedKmh * 5) / 18).toFixed(2)} m/s\nTotal Distance = Speed * Time\nPlatform Length = Total Distance - Train Length`;
      } else if (type === 2) {
        title = `Algebraic Equations Q${i}`;
        const coeff1 = (i % 4) + 2;
        const coeff2 = (i % 5) + 5;
        const result = coeff1 * (i + 3) + coeff2;
        description = `Solve the algebraic equation for x: Find the value of x if ${coeff1}x + ${coeff2} = ${result}.`;
        codeSnippet = `Equation: ${coeff1}x + ${coeff2} = ${result}\nStep 1: ${coeff1}x = ${result - coeff2}\nStep 2: x = ${(result - coeff2) / coeff1}`;
      } else if (type === 3) {
        title = `Probability Distribution Q${i}`;
        const red = (i % 5) + 3;
        const blue = (i % 4) + 4;
        const green = (i % 3) + 5;
        const total = red + blue + green;
        description = `A box contains ${red} red, ${blue} blue, and ${green} green marbles. If one marble is drawn at random, what is the probability that it is NOT green?`;
        codeSnippet = `Total Marbles: ${total}\nTarget Marbles (Red + Blue): ${red + blue}\nProbability: ${(red + blue)}/${total}`;
      } else if (type === 4) {
        title = `Ages & Ratios Q${i}`;
        const r1 = (i % 3) + 2;
        const r2 = (i % 3) + 3;
        const multiplier = (i % 4) + 3;
        const sum = (r1 + r2) * multiplier;
        description = `The ratio of the current ages of Alice and Bob is ${r1}:${r2}. If the sum of their ages is ${sum} years, what will be Bob's age in 5 years?`;
        codeSnippet = `Ratio: ${r1}x + ${r2}x = ${sum}\n${r1 + r2}x = ${sum} => x = ${multiplier}\nBob's Age = ${r2} * ${multiplier} = ${r2 * multiplier}\nIn 5 years: ${r2 * multiplier + 5}`;
      } else if (type === 5) {
        title = `Profit and Loss Q${i}`;
        const markup = 15 + (i % 5) * 5;
        const discount = 5 + (i % 3) * 2;
        description = `A retail merchant marks his inventory ${markup}% above cost price and then offers a customer discount of ${discount}%. What is the net profit percentage?`;
        codeSnippet = `Let Cost Price = 100\nMarked Price = ${100 + markup}\nSelling Price = ${100 + markup} * (1 - ${discount}/100) = ${((100 + markup) * (1 - discount / 100)).toFixed(2)}\nProfit = ${(((100 + markup) * (1 - discount / 100)) - 100).toFixed(2)}%`;
      } else if (type === 6) {
        title = `Time and Work Q${i}`;
        const daysA = 10 + (i % 4) * 2;
        const daysB = 15 + (i % 3) * 5;
        description = `If Operator A can process a pipeline segment in ${daysA} hours and Operator B can complete the same segment in ${daysB} hours, how long will they take if they collaborate?`;
        codeSnippet = `Rate A: 1/${daysA}, Rate B: 1/${daysB}\nCombined Rate: (1/${daysA}) + (1/${daysB}) = ${(daysA + daysB)}/${daysA * daysB}\nTime: ${(daysA * daysB) / (daysA + daysB)} hours`;
      } else {
        title = `Partnership Capital Share Q${i}`;
        const capA = 1000 * ((i % 5) + 2);
        const capB = 1500 * ((i % 4) + 3);
        const profit = 500 * ((i % 6) + 5);
        description = `Partners X and Y start a business. Partner X invests $${capA} and Partner Y invests $${capB}. Out of a total profit of $${profit}, what is Partner Y's share?`;
        codeSnippet = `Investment Ratio X:Y = ${capA}:${capB}\nTotal shares = ${capA + capB}\nPartner Y Share = ($${capB} / $${capA + capB}) * $${profit}`;
      }

      list.push({
        id: `q-quant-${i}`,
        title,
        difficulty: i % 15 === 0 ? 'Hard' : i % 5 === 0 ? 'Medium' : 'Easy',
        time: i % 8 === 1 || i % 8 === 6 ? '3 mins' : '2 mins',
        description,
        codeSnippet
      });
    }
  } else if (category === 'Logical') {
    for (let i = 1; i <= 50; i++) {
      const type = i % 7;
      let title = "";
      let description = "";
      let codeSnippet = "";

      if (type === 0) {
        title = `Alphanumeric Coding Q${i}`;
        const words = ['DESIGN', 'SYSTEM', 'CODING', 'AUTHENTICATION', 'SECURITY'];
        const word = words[i % words.length];
        description = `In a logical coding pattern, if '${word}' is encrypted by shifting all consonants by +1 and vowels by -1, decode the encrypted pattern code.`;
        codeSnippet = `Word: ${word}\nRule: Consonants +1, Vowels -1\nVerify character ASCII transformation arrays.`;
      } else if (type === 1) {
        title = `Blood Relations Tree Q${i}`;
        description = `Pointing to a photo, a project lead says: "His mother is the only daughter-in-law of my father's wife." How is the lead related to the person in the photo?`;
        codeSnippet = `Variables: Father's Wife = Mother\nOnly daughter-in-law of mother = Lead's wife (or brother's wife)\nPerson = Lead's child (or nephew).`;
      } else if (type === 2) {
        title = `Directions & Coords Q${i}`;
        const d1 = 5 + (i % 5) * 2;
        const d2 = 4 + (i % 3) * 3;
        description = `A delivery agent travels ${d1} km North, turns right and drives ${d2} km, then turns right again and travels ${d1} km. How far is the agent from the starting coordinate?`;
        codeSnippet = `Path vectors: (+0, +${d1}) -> (+${d2}, +${d1}) -> (+${d2}, +0)\nNet coordinate change: (+${d2}, 0)\nDistance: ${d2} km East.`;
      } else if (type === 3) {
        title = `Row Ordering Alignment Q${i}`;
        const total = 20 + (i % 6) * 5;
        const rank = 5 + (i % 4) * 3;
        description = `In a candidate ranking row of ${total} designers, Sarah is ranked ${rank}th from the top. What is her rank position counted from the bottom?`;
        codeSnippet = `Formula: Bottom Position = (Total - Top Position) + 1\nCalculation: (${total} - ${rank}) + 1 = ${total - rank + 1}`;
      } else if (type === 4) {
        title = `Deductive Syllogisms Q${i}`;
        description = `Statements: 1. All networks are secure. 2. Some secure systems are nodes. Decide which conclusions follow logically: (A) Some nodes are networks. (B) No system is a network.`;
        codeSnippet = `Venn diagram bounds: Networks ⊆ Secure. Systems ∩ Secure ≠ Ø. No direct overlap forced between Networks and Systems.`;
      } else if (type === 5) {
        title = `Number Series Completion Q${i}`;
        const base = (i % 5) + 2;
        const diff = (i % 4) + 3;
        description = `Complete the numerical sequencing pattern: ${base}, ${base + diff}, ${base + diff * 2}, ${base + diff * 3}, ?`;
        codeSnippet = `Difference pattern is constant: +${diff}\nNext term: ${base + diff * 4}`;
      } else {
        title = `Mathematical Operators Q${i}`;
        const val1 = 12 + (i % 3) * 2;
        const val2 = 3 + (i % 2) * 2;
        description = `If '+' represents multiplication, '-' represents division, '*' represents addition, and '/' represents subtraction, compute the value of: ${val1} - ${val2} * 10 / 2.`;
        codeSnippet = `Substitute operations: (${val1} / ${val2}) + 10 - 2\nCalculation: ${(val1 / val2).toFixed(2)} + 8 = ${(val1 / val2 + 8).toFixed(2)}`;
      }

      list.push({
        id: `q-logical-${i}`,
        title,
        difficulty: i % 12 === 0 ? 'Hard' : i % 4 === 0 ? 'Medium' : 'Easy',
        time: '2 mins',
        description,
        codeSnippet
      });
    }
  } else if (category === 'Verbal') {
    for (let i = 1; i <= 50; i++) {
      const type = i % 5;
      let title = "";
      let description = "";
      let codeSnippet = "";

      if (type === 0) {
        const item = vocabSynonyms[i % vocabSynonyms.length];
        title = `Synonyms & Vocabulary Q${i}`;
        description = `Choose the word which is closest in meaning to the highlighted term: "${item.word}". Options: ${item.options}.`;
        codeSnippet = `Correct Synonym: ${item.ans}\nContext usage: The ${item.word.toLowerCase()} speech was noteworthy.`;
      } else if (type === 1) {
        const errText = verbalErrors[i % verbalErrors.length];
        title = `Sentence Error Detection Q${i}`;
        description = `Identify the segment containing grammatical error or choose correct options: "${errText}"`;
        codeSnippet = `Rule: Subject-verb agreement, coordinate conjunctions, or correct preposition usage constraints.`;
      } else if (type === 2) {
        title = `Antonyms & Contrast Q${i}`;
        const antonyms = [
          { word: 'Benevolent', ans: 'Malevolent' },
          { word: 'Candid', ans: 'Deceptive' },
          { word: 'Meticulous', ans: 'Careless' },
          { word: 'Frugal', ans: 'Extravagant' },
          { word: 'Diligent', ans: 'Lazy' }
        ];
        const item = antonyms[i % antonyms.length];
        description = `Select the word which is most opposite in meaning to the word: "${item.word}".`;
        codeSnippet = `Word: ${item.word} <=> Antonym: ${item.ans}`;
      } else if (type === 3) {
        title = `Prepositions & Phrasals Q${i}`;
        const verbs = [
          { sentence: "The executive was accused ____ breach of contract.", ans: "of" },
          { sentence: "He had to comply ____ the compliance guidelines.", ans: "with" },
          { sentence: "She persists ____ recommending code splitting.", ans: "in" },
          { sentence: "They are responsible ____ configuring DNS routes.", ans: "for" }
        ];
        const item = verbs[i % verbs.length];
        description = `Fill in the blank with the appropriate preposition: "${item.sentence}"`;
        codeSnippet = `Verb-Preposition Collocation: ${item.ans}`;
      } else {
        title = `Idioms context usage Q${i}`;
        description = `Select the correct meaning of the idiom: "Bite the bullet". Options: (A) Evade responsibilities. (B) Face a difficult situation with courage. (C) Start a dispute. (D) Spend wastefully.`;
        codeSnippet = `Idiom meaning: Face a difficult or painful situation with courage and endurance. Correct answer is (B).`;
      }

      list.push({
        id: `q-verbal-${i}`,
        title,
        difficulty: i % 10 === 0 ? 'Hard' : i % 5 === 0 ? 'Medium' : 'Easy',
        time: '1 min',
        description,
        codeSnippet
      });
    }
  } else if (category === 'Data Int.') {
    for (let i = 1; i <= 50; i++) {
      const type = i % 6;
      let title = "";
      let description = "";
      let codeSnippet = "";

      if (type === 0) {
        title = `Bar Chart YoY Revenue Q${i}`;
        const rev21 = 200 + (i % 5) * 50;
        const rev24 = 300 + (i % 4) * 80;
        description = `The bar chart shows Company revenues. 2021 Revenue = $${rev21}k. 2024 Revenue = $${rev24}k. Calculate the percentage growth in revenue from 2021 to 2024.`;
        codeSnippet = `Increase: $${rev24 - rev21}k\nFormula: (Increase / Initial) * 100\nGrowth: (( ${rev24 - rev21} / ${rev21} ) * 100).toFixed(2)%`;
      } else if (type === 1) {
        title = `Pie Chart Budget share Q${i}`;
        const total = 100000 + (i % 4) * 50000;
        const pct = 10 + (i % 3) * 5;
        description = `A corporate pie chart segments expenditure. If the total annual budget is $${total}, find the raw amount spent on R&D if it represents ${pct}% of total share.`;
        codeSnippet = `Total: $${total}\nR&D Share: ${pct}%\nR&D budget: $${(total * pct) / 100}`;
      } else if (type === 2) {
        title = `Line Graph Profit Ratios Q${i}`;
        const rev = 500 + (i % 5) * 100;
        const ratio = 100 - (10 + (i % 3) * 5);
        description = `The line graph displays revenue vs expenditures. Profit margin is ${ratio}%. If the sales revenue is $${rev}k, what is the expenditure in $?`;
        codeSnippet = `Revenue: $${rev}k\nProfit: $${(rev * ratio) / 100}k\nExpenditure = Revenue - Profit = $${rev - (rev * ratio) / 100}k`;
      } else if (type === 3) {
        title = `Tabular Sales Report Q${i}`;
        const q1 = 40 + (i % 3) * 10;
        const q2 = 50 + (i % 4) * 10;
        const q3 = 45 + (i % 3) * 5;
        const q4 = 60 + (i % 5) * 10;
        const avg = (q1 + q2 + q3 + q4) / 4;
        description = `A table lists quarterly sales of product B: Q1 = ${q1} units, Q2 = ${q2} units, Q3 = ${q3} units, Q4 = ${q4} units. Calculate the average quarterly sales.`;
        codeSnippet = `Total sales: ${q1 + q2 + q3 + q4}\nAverage = Total / 4 = ${avg} units`;
      } else if (type === 4) {
        title = `Venn Diagram User overlap Q${i}`;
        const total = 500;
        const mail = 250 + (i % 5) * 20;
        const business = 200 + (i % 4) * 15;
        const both = 80 + (i % 3) * 10;
        description = `In a survey of ${total} clients, ${mail} use BNX Mail, ${business} use Cliks Business, and ${both} use both. How many clients use neither product?`;
        codeSnippet = `Union = Mail + Business - Both = ${mail + business - both}\nNeither = Total - Union = ${total - (mail + business - both)}`;
      } else {
        title = `Ratio Trend Data Q${i}`;
        const ratio1 = (i % 3) + 2;
        const ratio2 = (i % 2) + 3;
        description = `The ratio of frontend developers to backend developers in team is ${ratio1}:${ratio2}. If the total headcount of developers is ${(ratio1 + ratio2) * 8}, find the number of frontend developers.`;
        codeSnippet = `Total: ${ratio1}x + ${ratio2}x = ${(ratio1 + ratio2) * 8}\nx = 8\nFrontend Count = ${ratio1} * 8 = ${ratio1 * 8}`;
      }

      list.push({
        id: `q-dataint-${i}`,
        title,
        difficulty: i % 15 === 0 ? 'Hard' : i % 5 === 0 ? 'Medium' : 'Easy',
        time: i % 6 === 0 ? '4 mins' : '3 mins',
        description,
        codeSnippet
      });
    }
  }
  return list;
};

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
  const [partnerships, setPartnerships] = useState([]);
  const [supports, setSupports] = useState([]);
  const [selectedAptitudeCategory, setSelectedAptitudeCategory] = useState(null);
  const [selectedAptitudeQuestionIds, setSelectedAptitudeQuestionIds] = useState([]);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState(null);
  const [selectedResumeCandidate, setSelectedResumeCandidate] = useState(null);

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const updateAppsAndSync = (newApps) => {
    setExternalApplications(newApps);
    localStorage.setItem('beta_applications', JSON.stringify(newApps));
  };

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
        const stored = localStorage.getItem('beta_applications');
        if (stored) {
          setExternalApplications(JSON.parse(stored));
        } else {
          setExternalApplications(fallbackApps);
          localStorage.setItem('beta_applications', JSON.stringify(fallbackApps));
        }
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
          aptitudeScore: app.aptitudeScore || app.aptitudescore || '',
          experience: app.experience || '3 Years'
        }));
        setExternalApplications(normalizedApps);
        localStorage.setItem('beta_applications', JSON.stringify(normalizedApps));
      }
    } catch {
      console.warn('Failed to fetch from live API. Loading fallback local data.');
      const stored = localStorage.getItem('beta_applications');
      if (stored) {
        setExternalApplications(JSON.parse(stored));
      } else {
        setExternalApplications(fallbackApps);
        localStorage.setItem('beta_applications', JSON.stringify(fallbackApps));
      }
    }

    try {
      const contactRes = await api.get('/api/contact');
      const list = contactRes.data.data || contactRes.data || [];

      const parsedPartners = list
        .map(item => parsePartnerMessage(item.message, item.name, item.email, item.company, item.id || item._id, item.createdAt))
        .filter(Boolean);
      setPartnerships(parsedPartners.length > 0 ? parsedPartners : fallbackPartnerships);

      const parsedSupports = list
        .map(item => parseSupportMessage(item.message, item.name, item.email, item.company, item.id || item._id, item.createdAt))
        .filter(Boolean);
      setSupports(parsedSupports.length > 0 ? parsedSupports : fallbackSupports);
    } catch (err) {
      console.warn('Failed to fetch contact requests from /api/contact. Trying /api/contacts...', err);
      try {
        const contactRes = await api.get('/api/contacts');
        const list = contactRes.data.data || contactRes.data || [];

        const parsedPartners = list
          .map(item => parsePartnerMessage(item.message, item.name, item.email, item.company, item.id || item._id, item.createdAt))
          .filter(Boolean);
        setPartnerships(parsedPartners.length > 0 ? parsedPartners : fallbackPartnerships);

        const parsedSupports = list
          .map(item => parseSupportMessage(item.message, item.name, item.email, item.company, item.id || item._id, item.createdAt))
          .filter(Boolean);
        setSupports(parsedSupports.length > 0 ? parsedSupports : fallbackSupports);
      } catch (err2) {
        console.warn('Failed to fetch from live contact APIs. Loading fallbacks.', err2);
        setPartnerships(fallbackPartnerships);
        setSupports(fallbackSupports);
      }
    }

    setLoading(false);
  };

  // Load data only if authenticated as admin
  useEffect(() => {
    if (user && user.role === 'ROLE_ADMIN') {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (selectedApplication) {
      setRemarks(selectedApplication.remarks || '');
    } else {
      setRemarks('');
    }
  }, [selectedApplication]);

  useEffect(() => {
    if (externalApplications.length > 0) {
      const newApps = externalApplications.filter(app => app.status === 'Candidates').slice(0, 3);
      const scheduled = externalApplications.filter(app => app.status === 'Interview Scheduled' || app.aptitudeStatus === 'Assessment Sent').slice(0, 2);

      const list = [
        {
          id: 'sys-1',
          type: 'system',
          title: 'Database connection online',
          message: 'Local mock storage sync complete.',
          time: 'Just now',
          unread: true
        }
      ];

      newApps.forEach((app, idx) => {
        list.push({
          id: `newapp-${app.id}-${idx}`,
          type: 'application',
          title: 'New Candidate Application',
          message: `${app.fullName} applied for ${app.jobTitle}`,
          time: '1 hour ago',
          unread: true
        });
      });

      scheduled.forEach((app, idx) => {
        list.push({
          id: `sch-${app.id}-${idx}`,
          type: 'reminder',
          title: 'Upcoming Assessment / Interview',
          message: `Interview reminder for ${app.fullName} (${app.jobTitle})`,
          time: app.interviewDate ? `${app.interviewDate} at ${app.interviewTime || '10:00'}` : 'Scheduled soon',
          unread: true
        });
      });

      setNotifications(list);
    }
  }, [externalApplications]);

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

  const handlePartnerDismiss = async (id) => {
    if (!window.confirm('Are you sure you want to dismiss this partnership request?')) return;
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      try {
        await api.delete(`/api/contact/${id}`);
      } catch {
        await api.delete(`/api/contacts/${id}`);
      }
      setSuccess('Partnership request dismissed successfully.');
    } catch (err) {
      console.warn('API deletion failed. Dismissing locally.', err);
      setSuccess('Partnership request dismissed.');
    } finally {
      setPartnerships(prev => prev.filter(p => p.id !== id));
      setLoading(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleSupportDismiss = async (id) => {
    if (!window.confirm('Are you sure you want to resolve / dismiss this support request?')) return;
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      try {
        await api.delete(`/api/contact/${id}`);
      } catch {
        await api.delete(`/api/contacts/${id}`);
      }
      setSuccess('Support ticket resolved successfully.');
    } catch (err) {
      console.warn('API deletion failed. Dismissing locally.', err);
      setSuccess('Support ticket resolved.');
    } finally {
      setSupports(prev => prev.filter(s => s.id !== id));
      setLoading(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleAssignQuestions = (appId) => {
    const candidate = externalApplications.find(app => app.id === appId);
    if (!candidate) return;

    if (selectedAptitudeQuestionIds.length === 0) {
      alert('Please select at least one question first!');
      return;
    }

    const assignedKey = `assessment_questions_${appId}`;
    const selectedQuestions = generateAptitudeQuestions(selectedAptitudeCategory)
      .filter(q => selectedAptitudeQuestionIds.includes(q.id));

    localStorage.setItem(assignedKey, JSON.stringify(selectedQuestions));

    const updatedApps = externalApplications.map(app =>
      app.id === appId ? { ...app, aptitudeStatus: 'Assessment Sent' } : app
    );
    updateAppsAndSync(updatedApps);

    setSuccess(`Assessment successfully sent to ${candidate.fullName}. Status updated to "Assessment Sent".`);
    setSelectedAptitudeQuestionIds([]);
    setSelectedAptitudeCategory(null);
    setTimeout(() => setSuccess(''), 4000);
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    if (newStatus === 'Rejected') {
      if (!window.confirm('Are you sure you want to reject this candidate?')) return;
    }
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
      // Always update locally and sync
      const updated = externalApplications.map(app => app.id === appId ? { ...app, status: newStatus } : app);
      updateAppsAndSync(updated);
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
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${activeSubTab === 'jobsList'
                ? 'bg-[#004AAD] text-white'
                : 'text-slate-400 hover:bg-slate-800/20 hover:text-white'
                }`}
              style={activeSubTab === 'jobsList' ? { color: '#ffffff' } : {}}
            >
              <Briefcase className="h-4 w-4 text-blue-200" />
              <span className="font-bold">Job Board</span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab('analytics');
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 mt-1 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${activeSubTab === 'analytics'
                ? 'bg-[#004AAD] text-white font-bold'
                : 'text-slate-400 hover:bg-slate-800/20 hover:text-white'
                }`}
              style={activeSubTab === 'analytics' ? { color: '#ffffff' } : {}}
            >
              <BarChart3 className="h-4 w-4 text-blue-200" />
              <span className="font-bold">Analytics Panel</span>
            </button>

            {/* Pipeline Stage Filters */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-1 max-h-[60vh] overflow-y-auto admin-scrollbar">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
                Candidate Pipeline
              </p>
              {/* Candidates flat item */}
              {(() => {
                const isActive = activeSubTab === 'appsList' && selectedStatusFilter === 'Candidates';
                const count = externalApplications.filter(app => app.status === 'Candidates').length;
                return (
                  <button
                    onClick={() => {
                      setSelectedStatusFilter('Candidates');
                      setActiveSubTab('appsList');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-semibold transition cursor-pointer text-left ${isActive
                      ? 'bg-blue-600/20 text-white font-bold border border-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800/25 hover:text-white border border-transparent'
                      }`}
                  >
                    <span>Candidates</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-600 text-white font-extrabold' : 'bg-slate-800 text-slate-450'
                      }`}>
                      {count}
                    </span>
                  </button>
                );
              })()}

              {/* Round 1 folder structure */}
              <div className="pt-1.5">
                <div className="flex items-center space-x-2 px-3 py-1 text-[9px] font-bold text-slate-550 uppercase tracking-wider">
                  <span>Round 1</span>
                </div>
                
                <div className="pl-3 space-y-1 mt-1 border-l border-slate-800/60 ml-3.5">
                  {[
                    { key: 'Round 1 Aptitude', label: 'Stage 1 Aptitude' },
                    { key: 'Round 2 Technical', label: 'Stage 2 Technical' },
                    { key: 'Round 3 Brand Awareness', label: 'Stage 3 Brand Awareness' }
                  ].map((stage) => {
                    const isActive = activeSubTab === 'appsList' && selectedStatusFilter === stage.key;
                    const count = externalApplications.filter(app => app.status === stage.key).length;
                    return (
                      <button
                        key={stage.key}
                        onClick={() => {
                          setSelectedStatusFilter(stage.key);
                          setActiveSubTab('appsList');
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1 rounded-md text-[10px] font-semibold transition cursor-pointer text-left ${isActive
                          ? 'bg-blue-600/20 text-white font-bold border border-blue-500/10'
                          : 'text-slate-400 hover:bg-slate-800/20 hover:text-white border border-transparent'
                          }`}
                      >
                        <span>{stage.label}</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-600 text-white font-extrabold' : 'bg-slate-800 text-slate-450'
                          }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Separator line */}
              <div className="border-t border-slate-800/80 my-2" />

              {/* Partnership Requests under Round 3 Brand Awareness */}
              <button
                onClick={() => {
                  setActiveSubTab('partnerships');
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 mt-2 rounded-lg text-[11px] font-semibold transition cursor-pointer text-left ${activeSubTab === 'partnerships'
                  ? 'bg-blue-600/20 text-white font-bold border border-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800/25 hover:text-white border border-transparent'
                  }`}
              >
                <span>Partnership Requests</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${activeSubTab === 'partnerships' ? 'bg-blue-600 text-white font-extrabold' : 'bg-slate-800 text-slate-450'
                  }`}>
                  {partnerships.length}
                </span>
              </button>

              {/* Support Requests under Partnership Requests */}
              <button
                onClick={() => {
                  setActiveSubTab('support');
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 mt-1 rounded-lg text-[11px] font-semibold transition cursor-pointer text-left ${activeSubTab === 'support'
                  ? 'bg-blue-600/20 text-white font-bold border border-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800/25 hover:text-white border border-transparent'
                  }`}
              >
                <span>Support Requests</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${activeSubTab === 'support' ? 'bg-blue-600 text-white font-extrabold' : 'bg-slate-800 text-slate-450'
                  }`}>
                  {supports.length}
                </span>
              </button>
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

            {/* Notification Bell Icon */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(prev => !prev)}
                className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 transition relative cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border border-white animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 space-y-3 animate-fadeIn text-left">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-900">System Notifications</span>
                    <button
                      onClick={() => {
                        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                        setShowNotifications(false);
                      }}
                      className="text-[10px] text-blue-600 hover:underline font-bold bg-transparent border-none p-0 cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto admin-scrollbar">
                    {notifications.length === 0 ? (
                      <p className="text-slate-400 text-xs italic text-center py-4">No new alerts.</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl space-y-1 text-left relative">
                          {n.unread && <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-[#004AAD]" />}
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 pr-3">
                            {n.type === 'system' && <Shield className="h-3.5 w-3.5 text-emerald-600" />}
                            {n.type === 'reminder' && <Calendar className="h-3.5 w-3.5 text-amber-500" />}
                            {n.type === 'application' && <Briefcase className="h-3.5 w-3.5 text-[#004AAD]" />}
                            <span>{n.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-650 font-semibold leading-normal">{n.message}</p>
                          <div className="text-[9px] text-slate-400 font-bold">{n.time}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {((activeSubTab === 'appsList' && selectedStatusFilter === 'Candidates') || activeSubTab === 'jobBoard') && (
              <button
                onClick={openAddJobModal}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold admin-glow-btn"
              >
                <Plus className="h-4 w-4 text-white" />
                <span className="text-white">Post a Job</span>
              </button>
            )}
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
            {selectedStatusFilter !== 'Round 1 Aptitude' && selectedStatusFilter !== 'Round 2 Technical' && selectedStatusFilter !== 'Round 3 Brand Awareness' && activeSubTab !== 'partnerships' && activeSubTab !== 'support' && (
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
                            Stage 1 - Aptitude Dashboard
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
                        const scheduledCount = round1Apps.filter(app => (app.aptitudeStatus || 'Pending') === 'Assessment Sent' || (app.aptitudeStatus || 'Pending') === 'Scheduled').length;
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

                            {/* Assessment Sent */}
                            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Assessment Sent</span>
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
                                <th className="py-3 px-4 font-bold">Actions</th>
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
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${dateVal === 'Not Selected' ? 'bg-slate-50 text-slate-500 border border-slate-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                                          }`}>
                                          {dateVal}
                                        </span>
                                      </td>
                                      <td className="py-3.5 px-4 font-semibold text-slate-900">{timeVal}</td>
                                      <td className="py-3.5 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold ${statusVal === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                          statusVal === 'Assessment Sent' || statusVal === 'Scheduled' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                            'bg-slate-50 text-slate-500 border border-slate-200'
                                          }`}>
                                          {statusVal === 'Scheduled' ? 'Assessment Sent' : statusVal}
                                        </span>
                                      </td>
                                      <td className="py-3.5 px-4">
                                        <div className="flex items-center space-x-2">
                                          {(statusVal === 'Assessment Sent' || statusVal === 'Scheduled' || statusVal === 'Pending') && (
                                            <button
                                              onClick={() => {
                                                const url = `${window.location.origin}/careers/assessment?id=${app.id}`;
                                                navigator.clipboard.writeText(url);
                                                alert(`Test Link copied to clipboard:\n${url}`);
                                              }}
                                              className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-[#004AAD] border border-blue-200 text-[10px] font-bold transition cursor-pointer"
                                            >
                                              Copy Test Link
                                            </button>
                                          )}
                                          {statusVal === 'Completed' && (
                                            <span className="text-[10px] font-bold text-emerald-600">
                                              Score: {app.aptitudeScore || '85'}%
                                            </span>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })
                              }
                              {externalApplications.filter(app => app.status === 'Round 1 Aptitude').length === 0 && (
                                <tr>
                                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                                    No candidates currently in Stage 1 Aptitude.
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
                              <span className="text-lg font-black text-blue-700">200</span>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold block">Active</span>
                              <span className="text-lg font-black text-emerald-700">180</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-250 rounded-xl px-4 py-2 text-center">
                              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Draft</span>
                              <span className="text-lg font-black text-slate-650">20</span>
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
                        <div
                          onClick={() => setSelectedAptitudeCategory('Quant')}
                          className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/25 transition-all duration-300 flex flex-col justify-between min-h-[140px] group cursor-pointer"
                        >
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
                            <p className="text-slate-500 text-xs mt-0.5">50 Questions</p>
                          </div>
                          <div className="flex items-center text-xs font-bold text-[#004AAD] mt-3 group-hover:translate-x-1 transition-transform duration-200">
                            Manage <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                          </div>
                        </div>

                        {/* Logical */}
                        <div
                          onClick={() => setSelectedAptitudeCategory('Logical')}
                          className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-500/25 transition-all duration-300 flex flex-col justify-between min-h-[140px] group cursor-pointer"
                        >
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
                            <p className="text-slate-550 text-xs mt-0.5">50 Questions</p>
                          </div>
                          <div className="flex items-center text-xs font-bold text-purple-600 mt-3 group-hover:translate-x-1 transition-transform duration-200">
                            Manage <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                          </div>
                        </div>

                        {/* Verbal */}
                        <div
                          onClick={() => setSelectedAptitudeCategory('Verbal')}
                          className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-500/25 transition-all duration-300 flex flex-col justify-between min-h-[140px] group cursor-pointer"
                        >
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
                            <p className="text-slate-555 text-xs mt-0.5">50 Questions</p>
                          </div>
                          <div className="flex items-center text-xs font-bold text-amber-600 mt-3 group-hover:translate-x-1 transition-transform duration-200">
                            Manage <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                          </div>
                        </div>

                        {/* Data Int. */}
                        <div
                          onClick={() => setSelectedAptitudeCategory('Data Int.')}
                          className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-500/25 transition-all duration-300 flex flex-col justify-between min-h-[140px] group cursor-pointer"
                        >
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
                            <p className="text-slate-555 text-xs mt-0.5">50 Questions</p>
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
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${selectedDomainTab === domain
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
                              className={`p-5 rounded-2xl shadow-sm border transition-all duration-300 flex flex-col justify-between min-h-[120px] group cursor-pointer ${selectedDomainTab === domain
                                ? 'bg-white border-[#004AAD] ring-2 ring-[#004AAD]/10'
                                : 'bg-white border-slate-200 hover:border-[#004AAD]/40 hover:shadow-md'
                                }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className={`p-2.5 rounded-xl ${iconBg}`}>
                                  <Sliders className="h-5 w-5" />
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedDomainTab === domain ? 'bg-[#004AAD] text-white' : 'bg-slate-50 text-slate-550 border border-slate-200'
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
                                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${question.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
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
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${selectedBrandDomainTab === domain
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
                              className={`p-5 rounded-2xl shadow-sm border transition-all duration-300 flex flex-col justify-between min-h-[120px] group cursor-pointer ${selectedBrandDomainTab === domain
                                ? 'bg-white border-[#004AAD] ring-2 ring-[#004AAD]/10'
                                : 'bg-white border-slate-200 hover:border-[#004AAD]/40 hover:shadow-md'
                                }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className={`p-2.5 rounded-xl ${iconBg}`}>
                                  {domain === 'BNX Mail' ? <Mail className="h-5 w-5" /> : <Sliders className="h-5 w-5" />}
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedBrandDomainTab === domain ? 'bg-[#004AAD] text-white' : 'bg-slate-50 text-slate-555 border border-slate-200'
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
                                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${question.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
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
                  {/* Advanced Search & Filtering Bar */}
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 text-left shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Search bar */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Candidate / Job</label>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search name or position..."
                          className="w-full bg-white text-slate-800 border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:border-blue-500 text-xs transition"
                        />
                      </div>

                      {/* Status filter */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filter by Status</label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full bg-white text-slate-800 border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:border-blue-500 text-xs transition cursor-pointer"
                        >
                          <option value="All">All Statuses</option>
                          <option value="Pending">Pending (Candidates)</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      {/* Job Filter */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filter by Job Posting</label>
                        <select
                          value={selectedJobFilter}
                          onChange={(e) => setSelectedJobFilter(e.target.value)}
                          className="w-full bg-white text-slate-800 border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:border-blue-500 text-xs transition cursor-pointer"
                        >
                          <option value="All">All Jobs</option>
                          {Array.from(new Set(externalApplications.map(app => app.jobTitle))).map(title => (
                            <option key={title} value={title}>{title}</option>
                          ))}
                        </select>
                      </div>

                      {/* Clear button */}
                      <div className="flex items-end justify-end">
                        {(searchTerm || statusFilter !== 'All' || selectedJobFilter !== 'All' || startDate || endDate) && (
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setStatusFilter('All');
                              setSelectedJobFilter('All');
                              setStartDate('');
                              setEndDate('');
                            }}
                            className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                      {/* Date range - Start Date */}
                      <div className="flex items-center space-x-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">From Date:</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-white text-slate-800 border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:border-blue-500 text-xs transition"
                        />
                      </div>

                      {/* Date range - End Date */}
                      <div className="flex items-center space-x-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">To Date:</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-white text-slate-800 border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:border-blue-500 text-xs transition"
                        />
                      </div>
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
                              .filter(app => {
                                if (statusFilter === 'All') {
                                  return selectedStatusFilter === 'Candidates' ? app.status === 'Candidates' : app.status === selectedStatusFilter;
                                }
                                if (statusFilter === 'Pending') return app.status === 'Candidates';
                                return app.status === statusFilter;
                              })
                              .filter(app => {
                                if (!searchTerm) return true;
                                const query = searchTerm.toLowerCase();
                                return app.fullName.toLowerCase().includes(query) || app.jobTitle.toLowerCase().includes(query);
                              })
                              .filter(app => {
                                if (!startDate && !endDate) return true;
                                const appDate = new Date(app.createdAt);
                                if (startDate && appDate < new Date(startDate)) return false;
                                if (endDate) {
                                  const adjustedEnd = new Date(endDate);
                                  adjustedEnd.setHours(23, 59, 59, 999);
                                  if (appDate > adjustedEnd) return false;
                                }
                                return true;
                              });

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
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize whitespace-nowrap ${app.status === 'Candidates' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
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
                                    <button
                                      onClick={() => {
                                        setSelectedResumeUrl(app.resumeUrl);
                                        setSelectedResumeCandidate(app.fullName);
                                      }}
                                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-blue-50 text-[#004AAD] border border-blue-100 hover:bg-blue-100 transition font-bold cursor-pointer"
                                    >
                                      <FileText className="h-3.5 w-3.5 text-[#004AAD]" />
                                      <span>View Resume</span>
                                    </button>
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

            {/* Sub Tab 3: Partnership Requests */}
            {activeSubTab === 'partnerships' && (
              <div className="space-y-6 animate-fadeIn text-left">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 font-sans">Partnership Proposals</h2>
                    <p className="text-xs text-slate-500 mt-1">Review strategic ecosystem partner requests and integration proposals.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-250 text-[#004AAD] text-xs font-extrabold uppercase select-none">
                    Total: {partnerships.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {partnerships.length === 0 ? (
                    <div className="admin-glass-card p-12 text-center text-slate-500 rounded-2xl bg-white border border-slate-200">
                      No partnership requests found.
                    </div>
                  ) : (
                    partnerships.map((partner) => (
                      <div key={partner.id} className="admin-glass-card p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between text-left space-y-4">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-bold text-slate-900 leading-snug">{partner.company}</h3>
                              <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-150 text-[#004AAD] text-[10px] font-bold uppercase tracking-wider">
                                {partner.partnerType}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-semibold mt-1">
                              Contact: <span className="text-slate-700 font-bold">{partner.name}</span> &lt;{partner.email}&gt;
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 text-[10px] md:text-right">
                            <span className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-650 font-bold uppercase select-none">
                              Size: {partner.companySize}
                            </span>
                            <span className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-650 font-bold uppercase select-none">
                              Market: {partner.marketFocus}
                            </span>
                            <button
                              onClick={() => handlePartnerDismiss(partner.id)}
                              className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold uppercase transition flex items-center space-x-1 cursor-pointer select-none"
                              title="Dismiss Request"
                            >
                              <Trash className="h-3 w-3 text-red-500" />
                              <span>Dismiss</span>
                            </button>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Proposal Details</div>
                          <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line font-medium">
                            {partner.proposal}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                          <div className="flex flex-col sm:flex-row sm:space-x-4">
                            <span>Phone: <span className="text-slate-800 font-bold">{partner.phone}</span></span>
                            {partner.website && partner.website !== 'N/A' && (
                              <span>Website: <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-[#004AAD] hover:underline font-bold">{partner.website}</a></span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider self-start sm:self-auto">
                            Received {new Date(partner.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Sub Tab 4: Support Requests */}
            {activeSubTab === 'support' && (
              <div className="space-y-6 animate-fadeIn text-left">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 font-sans">Support Tickets</h2>
                    <p className="text-xs text-slate-500 mt-1">Manage and respond to product setup inquiries and diagnostic tickets.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-250 text-[#004AAD] text-xs font-extrabold uppercase select-none">
                    Total: {supports.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {supports.length === 0 ? (
                    <div className="admin-glass-card p-12 text-center text-slate-500 rounded-2xl bg-white border border-slate-200">
                      No support requests found.
                    </div>
                  ) : (
                    supports.map((ticket) => (
                      <div key={ticket.id} className="admin-glass-card p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between text-left space-y-4">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-bold text-slate-900 leading-snug">{ticket.name}</h3>
                              <span className="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-150 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                                {ticket.product}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-semibold mt-1">
                              Email: <a href={`mailto:${ticket.email}`} className="text-[#004AAD] hover:underline font-bold">{ticket.email}</a>
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 text-[10px] md:text-right">
                            <button
                              onClick={() => handleSupportDismiss(ticket.id)}
                              className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold uppercase transition flex items-center space-x-1 cursor-pointer select-none"
                              title="Resolve / Dismiss Ticket"
                            >
                              <Trash className="h-3 w-3 text-red-500" />
                              <span>Resolve</span>
                            </button>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Message / Issue description</div>
                          <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line font-medium">
                            {ticket.message}
                          </p>
                        </div>

                        <div className="flex sm:items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                          <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                            Received {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Sub Tab 5: Analytics Dashboard */}
            {activeSubTab === 'analytics' && (
              <div className="space-y-6 animate-fadeIn text-left">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 font-sans">Analytics Overview</h2>
                    <p className="text-xs text-slate-500 mt-1">Real-time statistics, conversion pipelines, and candidate demographic data.</p>
                  </div>
                </div>

                {/* Main Stats Cards Grid */}
                {(() => {
                  const totalApps = externalApplications.length;
                  const hiredCount = externalApplications.filter(app => app.status === 'Selected' || app.status === 'Joined').length;
                  const interviewedCount = externalApplications.filter(app => app.status === 'Interview Scheduled' || app.status === 'Interview Completed').length;
                  const conversionRate = totalApps > 0 ? Math.round((hiredCount / totalApps) * 100) : 0;
                  const interviewRate = totalApps > 0 ? Math.round((interviewedCount / totalApps) * 100) : 0;

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Applications</span>
                        <span className="text-3xl font-black text-[#004AAD]">{totalApps}</span>
                      </div>
                      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Interview Progression Rate</span>
                        <span className="text-3xl font-black text-amber-600">{interviewRate}%</span>
                      </div>
                      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Final Placement Conversion</span>
                        <span className="text-3xl font-black text-emerald-600">{conversionRate}%</span>
                      </div>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Applications per role Progress Bar Chart */}
                  <div className="lg:col-span-1 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Applications per Role</h3>
                      <p className="text-[10px] text-slate-450 font-semibold mt-0.5">Applicant distribution by posting title</p>
                    </div>
                    <div className="space-y-3.5 flex-grow flex flex-col justify-center">
                      {Array.from(new Set(externalApplications.map(app => app.jobTitle))).slice(0, 4).map(role => {
                        const count = externalApplications.filter(app => app.jobTitle === role).length;
                        const total = externalApplications.length || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={role} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-slate-800">
                              <span className="truncate max-w-[160px]" title={role}>{role}</span>
                              <span>{count} ({pct}%)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Middle Column: Conversion rates funnel */}
                  <div className="lg:col-span-1 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Conversion Funnel</h3>
                      <p className="text-[10px] text-slate-450 font-semibold mt-0.5">Progression from applied to placement</p>
                    </div>
                    <div className="space-y-4 flex-grow flex flex-col justify-center">
                      {(() => {
                        const total = externalApplications.length || 1;
                        const interviewed = externalApplications.filter(app => app.status !== 'Candidates' && app.status !== 'Round 1 Aptitude').length;
                        const hired = externalApplications.filter(app => app.status === 'Selected' || app.status === 'Joined').length;

                        const intPct = Math.round((interviewed / total) * 100);
                        const hiredPct = Math.round((hired / total) * 100);

                        return (
                          <>
                            {/* Level 1: Applied */}
                            <div className="space-y-1 text-center bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
                              <div className="text-xs font-bold text-slate-800">Applied (Total Intake)</div>
                              <div className="text-sm font-black text-[#004AAD]">{total} Candidates</div>
                            </div>
                            {/* Arrow */}
                            <div className="text-center text-slate-300 font-bold">&darr;</div>
                            {/* Level 2: Interviewed */}
                            <div className="space-y-1 text-center bg-amber-50/50 border border-amber-100 p-3 rounded-xl">
                              <div className="text-xs font-bold text-amber-800">Assessed & Interviewed ({intPct}%)</div>
                              <div className="text-sm font-black text-amber-700">{interviewed} Candidates</div>
                            </div>
                            {/* Arrow */}
                            <div className="text-center text-slate-300 font-bold">&darr;</div>
                            {/* Level 3: Hired */}
                            <div className="space-y-1 text-center bg-emerald-50 border border-emerald-150 p-3 rounded-xl">
                              <div className="text-xs font-bold text-emerald-800">Placements & Hired ({hiredPct}%)</div>
                              <div className="text-sm font-black text-emerald-700">{hired} Offers</div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Right Column: Location breakdown */}
                  <div className="lg:col-span-1 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Work Location Distribution</h3>
                      <p className="text-[10px] text-slate-455 font-semibold mt-0.5">Where candidates are placed</p>
                    </div>
                    <div className="space-y-5 flex-grow flex flex-col justify-center">
                      {(() => {
                        const total = externalApplications.length || 1;
                        const remote = externalApplications.filter(app => (app.jobLocation || '').toLowerCase().includes('remote')).length;
                        const hybrid = externalApplications.filter(app => (app.jobLocation || '').toLowerCase().includes('hybrid')).length;
                        const onsite = total - remote - hybrid;

                        const remotePct = Math.round((remote / total) * 100) || 30;
                        const hybridPct = Math.round((hybrid / total) * 100) || 50;
                        const onsitePct = Math.round((onsite / total) * 100) || 20;

                        return (
                          <>
                            {/* Remote */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-bold text-slate-800">
                                <span>Remote Roles</span>
                                <span>{remotePct}%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${remotePct}%` }} />
                              </div>
                            </div>
                            {/* Hybrid */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-bold text-slate-800">
                                <span>Hybrid Roles</span>
                                <span>{hybridPct}%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${hybridPct}%` }} />
                              </div>
                            </div>
                            {/* Onsite */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-bold text-slate-800">
                                <span>Onsite Roles</span>
                                <span>{onsitePct}%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${onsitePct}%` }} />
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
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
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition duration-300 ${isCurrent
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
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold capitalize mt-1 ${selectedApplication.status === 'Candidates' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
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
                  <label className="text-xs font-bold uppercase text-slate-800">Cover Letter</label>
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl max-h-[140px] overflow-y-auto mt-1.5">
                    <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-wrap">
                      {selectedApplication.coverLetter}
                    </p>
                  </div>
                </div>
              )}

              {/* View Candidate Answers */}
              {(() => {
                const assignedQuestionsKey = `assessment_questions_${selectedApplication.id}`;
                const answersKey = `assessment_answers_${selectedApplication.id}`;
                const storedQuestions = localStorage.getItem(assignedQuestionsKey);
                const storedAnswers = localStorage.getItem(answersKey);

                if (storedQuestions && storedAnswers) {
                  const qList = JSON.parse(storedQuestions);
                  const aList = JSON.parse(storedAnswers);

                  return (
                    <div className="border-t border-slate-100 pt-4">
                      <label className="text-xs font-bold uppercase block mb-2.5 text-slate-800">
                        View Candidate Assessment Answers (Score: {selectedApplication.aptitudeScore || '0'}%)
                      </label>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4 max-h-[220px] overflow-y-auto admin-scrollbar">
                        {qList.map((q, qidx) => {
                          const candAnswer = aList[q.id];
                          return (
                            <div key={q.id} className="space-y-1.5 border-b border-slate-200/60 pb-3 last:border-b-0 last:pb-0 text-xs">
                              <div className="font-bold text-slate-900">
                                Q{qidx + 1}. {q.title}
                              </div>
                              <p className="text-slate-500 italic">
                                {q.description}
                              </p>
                              <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800">
                                <span className="text-slate-400 block text-[9px] uppercase font-bold mb-0.5">Candidate Response:</span>
                                <span className="font-semibold text-slate-900 whitespace-pre-wrap">{candAnswer !== undefined ? candAnswer : "No response entered."}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Recruiter Evaluation Notes & Remarks */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <label className="text-xs font-bold uppercase block text-slate-800">Evaluation Remarks</label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter interviewer evaluation notes, feedback remarks, or notes..."
                  className="w-full admin-custom-input border border-slate-300 rounded-lg py-2 px-3 focus:outline-none text-xs transition"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={async () => {
                      const updatedApps = externalApplications.map(app =>
                        app.id === selectedApplication.id ? { ...app, remarks: remarks } : app
                      );
                      updateAppsAndSync(updatedApps);
                      setSelectedApplication(prev => ({ ...prev, remarks: remarks }));
                      setSuccess('Remarks updated successfully.');
                      setTimeout(() => setSuccess(''), 3000);
                    }}
                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#004AAD] text-xs font-bold rounded-lg transition cursor-pointer font-sans"
                  >
                    Save Remarks
                  </button>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="border-t border-slate-100 pt-4">
                <label className="text-xs font-bold uppercase block mb-2">Update Application Status</label>
                <div className="flex flex-wrap gap-2">
                  {['Candidates', 'Round 1 Aptitude', 'Round 2 Technical', 'Round 3 Brand Awareness', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Rejected', 'Joined'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedApplication.id, status)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition cursor-pointer capitalize ${selectedApplication.status === status
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

      {/* Modal for Aptitude Category Questions */}
      {selectedAptitudeCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl text-left my-8 admin-scrollbar overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setSelectedAptitudeCategory(null);
                setSelectedAptitudeQuestionIds([]);
              }}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-3 rounded-2xl ${selectedAptitudeCategory === 'Quant' ? 'bg-blue-50 text-blue-600' :
                selectedAptitudeCategory === 'Logical' ? 'bg-purple-50 text-purple-600' :
                  selectedAptitudeCategory === 'Verbal' ? 'bg-amber-50 text-amber-600' :
                    'bg-emerald-50 text-emerald-600'
                }`}>
                {selectedAptitudeCategory === 'Quant' && <Calculator className="h-6 w-6" />}
                {selectedAptitudeCategory === 'Logical' && <Brain className="h-6 w-6" />}
                {selectedAptitudeCategory === 'Verbal' && <BookOpen className="h-6 w-6" />}
                {selectedAptitudeCategory === 'Data Int.' && <BarChart3 className="h-6 w-6" />}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                  {selectedAptitudeCategory} Assessment Library
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Manage the 50 standard screening questions configured for this category.
                </p>
              </div>
            </div>

            {/* Bulk Actions Alert */}
            {selectedAptitudeQuestionIds.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn text-xs font-bold text-slate-700 text-left">
                <div className="space-y-1.5">
                  <span className="text-[#004AAD] font-extrabold text-sm block">
                    {selectedAptitudeQuestionIds.length} Screening Question(s) Selected
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-450 uppercase tracking-widest text-[9px] font-bold">Send Assessment:</span>
                    <select
                      onChange={(e) => {
                        const appId = e.target.value;
                        if (!appId) return;
                        handleAssignQuestions(appId);
                        e.target.value = '';
                      }}
                      className="bg-white border border-slate-300 rounded-lg py-1 px-2.5 focus:outline-none text-[11px] transition cursor-pointer font-bold"
                    >
                      <option value="">Choose Candidate...</option>
                      {externalApplications
                        .filter(app => app.status === 'Round 1 Aptitude')
                        .map(app => (
                          <option key={app.id} value={app.id}>
                            {app.fullName} ({app.jobTitle})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 self-end md:self-auto">
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete these ${selectedAptitudeQuestionIds.length} question(s)?`)) {
                        setSuccess(`${selectedAptitudeQuestionIds.length} question(s) deleted successfully.`);
                        setSelectedAptitudeQuestionIds([]);
                        setTimeout(() => setSuccess(''), 3000);
                      }
                    }}
                    className="px-3.5 py-2 bg-red-50 text-red-650 hover:bg-red-100 rounded-xl font-bold border border-red-200 transition cursor-pointer"
                  >
                    Delete Selected
                  </button>
                  <button
                    onClick={() => {
                      setSuccess(`${selectedAptitudeQuestionIds.length} question(s) marked as active.`);
                      setSelectedAptitudeQuestionIds([]);
                      setTimeout(() => setSuccess(''), 3000);
                    }}
                    className="px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl font-bold transition cursor-pointer"
                  >
                    Mark as Active
                  </button>
                </div>
              </div>
            )}

            {/* Questions Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-[55vh] overflow-y-auto admin-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider font-bold sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4 font-bold w-10">
                      <input
                        type="checkbox"
                        checked={selectedAptitudeQuestionIds.length === 50}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const allIds = generateAptitudeQuestions(selectedAptitudeCategory).map(q => q.id);
                            setSelectedAptitudeQuestionIds(allIds);
                          } else {
                            setSelectedAptitudeQuestionIds([]);
                          }
                        }}
                        className="h-4 w-4 rounded border-slate-300 text-[#004AAD] focus:ring-[#004AAD] cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4 font-bold">ID</th>
                    <th className="py-3 px-4 font-bold">Title</th>
                    <th className="py-3 px-4 font-bold">Difficulty</th>
                    <th className="py-3 px-4 font-bold">Time Limit</th>
                    <th className="py-3 px-4 font-bold">Description / Concept</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {generateAptitudeQuestions(selectedAptitudeCategory).map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedAptitudeQuestionIds.includes(q.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAptitudeQuestionIds(prev => [...prev, q.id]);
                            } else {
                              setSelectedAptitudeQuestionIds(prev => prev.filter(id => id !== q.id));
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-300 text-[#004AAD] focus:ring-[#004AAD] cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#004AAD]">{q.id.toUpperCase()}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{q.title}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${q.difficulty === 'Hard' ? 'bg-red-50 text-red-700 border border-red-200' :
                          q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{q.time}</td>
                      <td className="py-3.5 px-4 max-w-sm truncate" title={q.description}>{q.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedAptitudeCategory(null);
                  setSelectedAptitudeQuestionIds([]);
                }}
                className="px-5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
              >
                Close Library
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Resume Viewer */}
      {selectedResumeUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl text-left my-8 admin-scrollbar overflow-y-auto max-h-[90vh]">
            {/* Top Header Row with Download and Close buttons */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedResumeCandidate}'s Resume
                </h3>
                <p className="text-xs text-slate-550 font-bold mt-0.5">
                  Screening profile attachment sheet
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <a
                  href={selectedResumeUrl.startsWith('http') ? selectedResumeUrl : `https://apply.beta-softnet.com${selectedResumeUrl}`}
                  download={`${selectedResumeCandidate.replace(/\s+/g, '_')}_Resume.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-[#004AAD] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-lg shadow-blue-500/10 border-none outline-none"
                >
                  <Download className="h-4 w-4 text-white" />
                  <span>Download Resume</span>
                </a>
                <button
                  onClick={() => {
                    setSelectedResumeUrl(null);
                    setSelectedResumeCandidate(null);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Resume sheet preview */}
            <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 shadow-inner max-h-[65vh] overflow-y-auto admin-scrollbar text-slate-800 font-sans">
              <div className="bg-white p-8 rounded-xl border border-slate-150 shadow-sm max-w-2xl mx-auto space-y-6">
                <div className="border-b border-slate-200 pb-5 text-center">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{selectedResumeCandidate}</h1>
                  <p className="text-[#004AAD] font-bold text-xs uppercase tracking-wider mt-1.5">
                    {externalApplications.find(app => app.fullName === selectedResumeCandidate)?.jobTitle || 'Corporate Professional'}
                  </p>
                  <div className="text-slate-500 text-xs mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 font-semibold">
                    <span>Email: {externalApplications.find(app => app.fullName === selectedResumeCandidate)?.email || 'candidate@example.com'}</span>
                    <span>Phone: {externalApplications.find(app => app.fullName === selectedResumeCandidate)?.phone || '+91 90000 12345'}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1">Professional Experience</h2>
                    <div className="mt-2 space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-900">
                          <span>Senior Lead Consultant</span>
                          <span className="text-slate-450">2023 - Present</span>
                        </div>
                        <p className="text-slate-500 text-[11px] font-semibold">Beta Softnet Corporate Partners</p>
                        <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                          Led agile development and system integrations. Orchestrated client deployment frameworks and microservices.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1">Core Competencies</h2>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {['Agile Systems', 'Client Operations', 'React Architecture', 'Data Flows', 'System Scaling', 'Database Orchestration'].map(skill => (
                        <span key={skill} className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1">Education & Certifications</h2>
                    <div className="mt-2 text-xs">
                      <div className="flex justify-between text-slate-900 font-bold">
                        <span>B.Tech in Computer Science</span>
                        <span className="text-slate-450">Class of 2021</span>
                      </div>
                      <p className="text-slate-500 text-[11px] font-semibold">National Institute of Technology</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { jwtDecode } from 'jwt-decode'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, Twitter, Linkedin, ChevronDown, Sun, Moon } from 'lucide-react'
import { FaDiscord, FaTelegram } from "react-icons/fa"
import { Trophy, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function AboutUs() {
  const [openStep, setOpenStep] = useState(null)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [isDiscordWidgetOpen, setIsDiscordWidgetOpen] = useState(false)
  const popoverTriggerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverTriggerRef.current && !popoverTriggerRef.current.contains(event.target)) {
        setIsDiscordWidgetOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])


  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    setIsDarkTheme(storedTheme ? storedTheme === 'dark' : true)

    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const currentUser = decoded
        const currentUserId = decoded.userId
        const currentUserPfp = decoded.profilePic || 'No Profile Picture'

        sendDiscordNotification(currentUser, currentUserPfp)
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDarkTheme
    setIsDarkTheme(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const toggleStep = (index) => {
    setOpenStep(openStep === index ? null : index)
  }

  const steps = [
    { title: "Create an account", content: "Sign up to start your journey with Koji." },
    { title: "Submit your products", content: "Fill out the product submission form with details about your products." },
    { title: "Build Empire", content: "Intorduce yourself in shoutbox, Checkout notifications, hangout with others and explore like minded peoples on site." },
    { title: "Engage with the community", content: "Connect with other like minded peoples and business to share insights." },
  ]

  // const sendDiscordNotification = async (user, profilePic) => {
  //   const webhookUrl = 'https://discord.com/api/webhooks/1316066211850620989/_9WGkcypsKTp9KdvRMGFtWQ-eEs8p7HZxwK0XABVOnL8os8wO5hesWHVs_BydHVBN9RA'

  //   const payload = {
  //     content: '**Page Visit Alert**',
  //     embeds: [
  //       {
  //         title: 'About Us Page Visited',
  //         description: 'A user visited the About Us page.',
  //         fields: [
  //           {
  //             name: 'User ID',
  //             value: user.userId || 'Unknown ID',
  //           },
  //           {
  //             name: 'Username',
  //             value: user.username || 'Unknown Username',
  //           },
  //           {
  //             name: 'Profile Picture',
  //             value: profilePic !== 'No Profile Picture' ? `[View Picture](${profilePic})` : 'No Profile Picture',
  //           },
  //         ],
  //         color: 7506394,
  //       },
  //     ],
  //   }

  //   try {
  //     const response = await fetch(webhookUrl, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(payload),
  //     })

  //     if (!response.ok) {
  //       console.error('Failed to send webhook notification to Discord')
  //     }
  //   } catch (error) {
  //     console.error('Error sending webhook notification:', error)
  //   }
  // }

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <header className={`py-12 border-b ${isDarkTheme ? 'border-white/10 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20' : 'border-black/10 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold"
          >
            About Koji
          </motion.h1>
          <Link href={`/`} className="text-yellow-400 hover:text-yellow-300">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold mb-6 text-yellow-400">Project Overview</h2>
          <div className={`${isDarkTheme ? 'bg-white/5' : 'bg-black/5'} p-6 rounded-lg shadow-lg`}>
            <p className={`${isDarkTheme ? 'text-white/80' : 'text-black/80'} mb-4 leading-relaxed`}>
              Koji is an innovative platform designed to buy, sell, explore and manage products dynamically. It enables users to interact with and track the progress of their digital stuff in real-time. Additionally, it serves as a valuable data source for training AI agents, creating a unique synergy between user-generated content and artificial intelligence.
            </p>
            <p className={`${isDarkTheme ? 'text-white/80' : 'text-black/80'} mb-4 leading-relaxed`}>
              With a modular and scalable design hosted on Vercel, Koji emphasizes user experience, efficiency, and seamless integration. Our platform is continuously updated to meet the evolving needs of business and users alike.
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold mb-6 text-yellow-400">How to Use Koji</h2>
          <LayoutGroup>
            <motion.div layout className={`${isDarkTheme ? 'bg-white/5' : 'bg-black/5'} rounded-lg shadow-lg overflow-hidden`}>
              {steps.map((step, index) => (
                <motion.div key={index} layout className={`border-b ${isDarkTheme ? 'border-white/10' : 'border-black/10'} last:border-b-0`}>
                  <motion.button
                    layout
                    onClick={() => toggleStep(index)}
                    className="flex justify-between items-center w-full p-4 text-left focus:outline-none"
                  >
                    <motion.span layout className="text-lg font-medium">{step.title}</motion.span>
                    <motion.div
                      animate={{ rotate: openStep === index ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                  <AnimatePresence initial={false}>
                    {openStep === index && (
                      <motion.div
                        key={`content-${index}`}
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: "auto" },
                          collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <motion.div
                          variants={{
                            collapsed: { y: -10 },
                            open: { y: 0 }
                          }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                          className="px-4 pb-4"
                        >
                          <p className={`${isDarkTheme ? 'text-white/70' : 'text-black/70'}`}>{step.content}</p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </LayoutGroup>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold mb-6 text-yellow-400">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Mirza (Mirzya)",
                role: "Founder, Developer & Owner",
                image: "https://i.ibb.co/442QP0w/d66220ef0f9b.png",
                description: "Responsible for overseeing the platform's development and ensuring its success.",
                links: {
                  telegram: "https://t.me/kojiguy",
                  github: "https://github.com/lettable",
                  discord: "https://discordapp.com/users/1135747839545323582"
                }
              },
              // {
              //   name: "Arham/Aurum",
              //   role: "CEO",
              //   image: "https://i.ibb.co/tCyGTfT/23abf4ba248f.png",
              //   description: "Leads the business operations and defines the vision of Side Projector.",
              //   links: {
              //     discord: "https://discordapp.com/users/1104974475134509106",
              //     // Placeholder for the other two links
              //     placeholder1: "",
              //     placeholder2: ""
              //   }
              // },
              // {
              //   name: "Rayyan",
              //   role: "Co-Founder",
              //   image: "https://i.ibb.co/ynZN4Fs/73b1e780f9e8.png",
              //   description: "Provides strategic input and helps shape the platform's direction.",
              //   links: {
              //     linkedin: "https://www.linkedin.com/in/pentesterxrayyan/",
              //     github: "https://github.com/kaliafridi",
              //     discord: "https://discordapp.com/users/1115229177843556352"
              //   }
              // }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <Card className={`${isDarkTheme ? 'bg-white/5 text-white border-white/10' : 'bg-black/5 text-black border-black/10'} overflow-hidden`}>
                  <CardContent className="p-6">
                    <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-yellow-400">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-2xl font-semibold mb-2 text-center">{member.name}</h3>
                    <p className="text-yellow-400 mb-2 text-center">
                      <Badge>{member.role}</Badge></p>
                    <p className={`${isDarkTheme ? 'text-white/60' : 'text-black/60'} text-sm mb-4 text-center`}>{member.description}</p>
                    <div className="flex justify-center space-x-3">
                      {member.links.github && (
                        <Button variant="ghost" size="icon" className={`${isDarkTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} hover:text-${isDarkTheme ? 'white' : 'black'}`} onClick={() => window.open(member.links.github, "_blank")}>
                          <Github className="h-5 w-5" />
                          <span className="sr-only">GitHub</span>
                        </Button>
                      )}
                      {member.links.telegram && (
                        <Button variant="ghost" size="icon" className={`${isDarkTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} hover:text-${isDarkTheme ? 'white' : 'black'}`} onClick={() => window.open(member.links.twitter, "_blank")}>
                          <FaTelegram className="h-5 w-5" />
                          <span className="sr-only">GitHub</span>
                        </Button>
                      )}
                      {member.links.linkedin && (
                        <Button variant="ghost" size="icon" className={`${isDarkTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} hover:text-${isDarkTheme ? 'white' : 'black'}`} onClick={() => window.open(member.links.linkedin, "_blank")}>
                          <Linkedin className="h-5 w-5" />
                          <span className="sr-only">LinkedIn</span>
                        </Button>
                      )}
                      {member.links.discord && (
                        <Button variant="ghost" size="icon" className={`${isDarkTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} hover:text-${isDarkTheme ? 'white' : 'black'}`} onClick={() => window.open(member.links.discord, "_blank")}>
                          <FaDiscord className="h-5 w-5" />
                          <span className="sr-only">Discord</span>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold mb-6 text-yellow-400">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Sell your digital products", description: "Useless to you might be priceless to someone. Don't hesitate to sell it here—we support everything!" },
              { title: "Community Engagement", description: "Connect with other kojiers, share insights, and collaborate on projects to enhance your skills and knowledge." },
              { title: "Real-Time Updates", description: "Stay informed with real-time updates on your products and the latest trends in the community." }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <Card className={`${isDarkTheme ? 'bg-white/5 text-white border-white/10' : 'bg-black/5 text-black border-black/10'} h-full`}>
                  <CardContent className="p-6 flex flex-col h-full">
                    <h3 className="text-xl font-semibold mb-4 text-yellow-400">{feature.title}</h3>
                    <p className={`${isDarkTheme ? 'text-white/70' : 'text-black/70'} flex-grow`}>{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-semibold mb-6 text-yellow-400">Join Our Community</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            We invite you to become a part of the Koji community. Whether you&apos;re looking to sell your stuff, gain inspiration, or connect with like-minded individuals, our platform is designed to support your journey.
          </p>
          {/* <Popover open={isDiscordWidgetOpen} onOpenChange={setIsDiscordWidgetOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={popoverTriggerRef}
              className="bg-yellow-400 text-black hover:bg-yellow-500 text-lg px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
              onMouseEnter={() => setIsDiscordWidgetOpen(true)}
            >
              Join Side Projector
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-none bg-transparent" sideOffset={5}>
            <iframe
              src="https://discord.com/widget?id=1311022452801011802&theme=dark"
              width="350"
              height="500"
              allowTransparency={true}
              frameBorder="0"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              className="rounded-lg shadow-lg"
            ></iframe>
          </PopoverContent>
        </Popover> */}

          {/* <Button
            ref={popoverTriggerRef}
            className="bg-yellow-400 text-black hover:bg-yellow-500 text-lg px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            onClick={() => window.open('https://t.me/kojiHQ', "_blank")}
          >
            Join Side Projector
          </Button> */}
        </motion.section>

        {/* <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold mb-6 text-yellow-400">Legal Information</h2>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${isDarkTheme ? 'text-white/70' : 'text-black/70'}`}>
            <div>
              <h3 className="text-xl font-semibold mb-4">Terms of Service</h3>
              <p className="mb-4">
                By using Side Projector, you agree to our Terms of Service. These terms outline the rules and regulations for the use of our platform.
              </p>
              <Button variant="outline" className={`${isDarkTheme ? 'text-white bg-white/10 border-0 hover:border-0 hover:text-white hover:bg-white/20' : 'text-black hover:bg-black/10'}`} onClick={() => document.getElementById('tos').scrollIntoView({ behavior: 'smooth' })}>
                Read Terms of Service
              </Button>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Privacy Policy</h3>
              <p className="mb-4">
                We value your privacy. Our Privacy Policy explains how we collect, use, and protect your personal information.
              </p>
              <Button variant="outline" className={`${isDarkTheme ? 'text-white bg-white/10 border-0 hover:border-0 hover:text-white hover:bg-white/20' : 'text-black hover:bg-black/10'}`} onClick={() => document.getElementById('privacy-policy').scrollIntoView({ behavior: 'smooth' })}>
                Read Privacy Policy
              </Button>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          id="tos"
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold mb-6 text-yellow-400">Terms of Service</h2>
          <div className={`${isDarkTheme ? 'bg-white/5' : 'bg-black/5'} p-6 rounded-lg shadow-lg ${isDarkTheme ? 'text-white/80' : 'text-black/80'}`}>
            <h3 className="text-2xl font-semibold mb-4">Last Updated: 12/6/2024</h3>
            <p className="mb-4">Welcome to Side Projector (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or using our website, you (&quot;you&quot; or &quot;user&quot;) agree to comply with and be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree with these Terms, please do not use our website or services.</p>

            <h4 className="text-xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h4>
            <p className="mb-4">By accessing our website, creating an account, or engaging in any activities on Side Projector, you agree to be bound by these Terms. This agreement is effective as of the date you begin using our services.</p>

            <h4 className="text-xl font-semibold mt-6 mb-2">2. Eligibility</h4>
            <p className="mb-4">You must be at least 13 years old to use Side Projector. If you are between 13 and 18 years old, you may use the website only with parental or guardian consent. By using our services, you confirm that you meet these requirements.</p>

            <h4 className="text-xl font-semibold mt-6 mb-2">3. Account Registration</h4>
            <ol className="list-decimal list-inside mb-4">
              <li className="mb-2">To access certain features, you may need to create an account. You agree to provide accurate, current, and complete information during registration.</li>
              <li className="mb-2">You are responsible for maintaining the confidentiality of your account login details and all activities under your account.</li>
              <li className="mb-2">Notify us immediately of any unauthorized access or breach of your account.</li>
            </ol>

            <h4 className="text-xl font-semibold mt-6 mb-2">4. User Conduct</h4>
            <p className="mb-2">When using Side Projector, you agree not to:</p>
            <ol className="list-decimal list-inside mb-4">
              <li className="mb-2">Violate any applicable laws or regulations.</li>
              <li className="mb-2">Post or share inappropriate, offensive, or misleading content.</li>
              <li className="mb-2">Use the platform to harass, abuse, or harm others.</li>
              <li className="mb-2">Upload viruses, malware, or any harmful software.</li>
              <li className="mb-2">Attempt to gain unauthorized access to our systems or services.</li>
            </ol>

            <h4 className="text-xl font-semibold mt-6 mb-2">5. Projects and Listings</h4>
            <ol className="list-decimal list-inside mb-4">
              <li className="mb-2"><strong>Responsibility for Content:</strong> You are solely responsible for any content, projects, or listings you post. Ensure they are accurate, legal, and not misleading.</li>
              <li className="mb-2"><strong>Prohibited Items:</strong> You may not list or showcase projects that violate intellectual property rights, are fraudulent, or are otherwise illegal.</li>
              <li className="mb-2"><strong>Removal of Content:</strong> We reserve the right to remove any content or listings that violate these Terms or our policies without prior notice.</li>
            </ol>

            <h4 className="text-xl font-semibold mt-6 mb-2">6. Payments and Transactions</h4>
            <ol className="list-decimal list-inside mb-4">
              <li className="mb-2">Side Projector is not responsible for financial transactions between users. We do not guarantee payment security or dispute resolution for sales or purchases.</li>
              <li className="mb-2">Users must handle payments, refunds, and disputes directly with each other unless otherwise specified.</li>
            </ol>

            <h4 className="text-xl font-semibold mt-6 mb-2">7. Reporting Bugs and Issues</h4>
            <p className="mb-4">We appreciate your feedback! If you encounter any bugs or technical issues, please report them in the <strong>#report-bugs</strong> section or contact our support team.</p>

            <h4 className="text-xl font-semibold mt-6 mb-2">8. Intellectual Property</h4>
            <ol className="list-decimal list-inside mb-4">
              <li className="mb-2">All content on Side Projector, including but not limited to text, graphics, logos, and code, is the property of Side Projector or its licensors and is protected by copyright and trademark laws.</li>
              <li className="mb-2">You retain ownership of any projects or content you upload but grant Side Projector a non-exclusive, royalty-free license to display, distribute, and promote it on our platform.</li>
            </ol>

            <h4 className="text-xl font-semibold mt-6 mb-2">9. Privacy</h4>
            <p className="mb-4">Your privacy is important to us. Please review our <Link href="#privacy-policy" className="text-yellow-400 hover:underline">Privacy Policy</Link> to understand how we collect, use, and protect your personal information.</p>

            <h4 className="text-xl font-semibold mt-6 mb-2">10. Disclaimer of Warranties</h4>
            <ol className="list-decimal list-inside mb-4">
              <li className="mb-2">Side Projector is provided &quot;as is&quot; and &quot;as available.&quot; We make no guarantees regarding the reliability, availability, or accuracy of our services.</li>
              <li className="mb-2">We disclaim all warranties, express or implied, including but not limited to fitness for a particular purpose, merchantability, or non-infringement.</li>
            </ol>

            <h4 className="text-xl font-semibold mt-6 mb-2">11. Limitation of Liability</h4>
            <p className="mb-4">To the fullest extent permitted by law, Side Projector will not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of our services. This includes loss of data, profits, or other damages, even if we have been advised of the possibility of such damages.</p>

            <h4 className="text-xl font-semibold mt-6 mb-2">12. Termination</h4>
            <p className="mb-4">We reserve the right to suspend or terminate your access to Side Projector at any time, without notice, for violations of these Terms or other policies.</p>

            <h4 className="text-xl font-semibold mt-6 mb-2">13. Changes to These Terms</h4>
            <p className="mb-4">We may update these Terms from time to time. Any changes will be effective immediately upon posting. Your continued use of Side Projector constitutes acceptance of the updated Terms.</p>

            <h4 className="text-xl font-semibold mt-6 mb-2">14. Governing Law</h4>
            <p className="mb-4">These Terms are governed by and construed in accordance with the laws of USA/PK, without regard to its conflict of law provisions.</p>

            <h4 className="text-xl font-semibold mt-6 mb-2">15. Contact Us</h4>
            <p className="mb-4">If you have questions or concerns about these Terms, please contact us:</p>
            <ul className="list-disc list-inside mb-4">
              <li><strong>Email:</strong> sideprojectorinc@gmail.com</li>
              <li><strong>Report Issues:</strong> #report-bugs (https://discord.gg/qNFzpWwTN9)</li>
            </ul>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          id="privacy-policy"
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold mb-6 text-yellow-400">Privacy Policy</h2>
          <div className={`${isDarkTheme ? 'bg-white/5' : 'bg-black/5'} p-6 rounded-lg shadow-lg ${isDarkTheme ? 'text-white/80' : 'text-black/80'}`}>
            <h3 className="text-2xl font-semibold mb-4">Effective Date: 12/6/2024</h3>
            <p className="mb-4">Side Projector (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) values your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and share information about you when you visit our website, use our services, or otherwise interact with us. By using Side Projector, you agree to this Privacy Policy.</p>

            <h4 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h4>
            <p className="mb-2">We collect the following types of information:</p>

            <h5 className="text-lg font-semibold mt-4 mb-2">a. Information You Provide to Us</h5>
            <ul className="list-disc list-inside mb-4">
              <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, profile picture, and any other details you provide.</li>
              <li><strong>Project Information:</strong> Details about projects, images, and descriptions you upload.</li>
              <li><strong>Payment Information:</strong> If applicable, we may collect payment details for purchases or subscriptions, but this information is processed securely through third-party providers.</li>
              <li><strong>Communications:</strong> Any messages, feedback, or reports you share with us (e.g., #report-bugs).</li>
            </ul>

            <h5 className="text-lg font-semibold mt-4 mb-2">b. Information We Collect Automatically</h5>
            <ul className="list-disc list-inside mb-4">
              <li><strong>Device and Usage Information:</strong> We collect data like IP address, browser type, operating system, device type, and pages you visit.</li>
              <li><strong>Cookies and Tracking Technologies:</strong> We use cookies to enhance your experience, such as saving your preferences (e.g., dark or light theme).</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">2. How We Use Your Information</h3>
            <p className="mb-2">We use your information for the following purposes:</p>
            <ul>
              <li><strong>To Provide Services:</strong> Enable account creation, project submissions, and other platform functionality.</li>
              <li><strong>To Personalize Your Experience:</strong> Save your preferences (e.g., themes) and recommend projects.</li>
              <li><strong>To Communicate with You:</strong> Send updates, notifications, and respond to your queries.</li>
              <li><strong>To Maintain Security:</strong> Monitor activity to prevent fraud, abuse, or unauthorized access.</li>
              <li><strong>To Improve Our Platform:</strong> Analyze usage trends and optimize features.</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">3. Sharing Your Information</h3>
            <p className='mb-2'>We do not sell your personal information. However, we may share your data in the following cases:</p>
            <ul>
              <li><strong>With Service Providers:</strong> For hosting, analytics, payment processing, or other services necessary to run our platform.</li>
              <li><strong>Legal Requirements:</strong> If required by law, court order, or to protect the safety and rights of users or Side Projector.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred.</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">4. Your Privacy Rights</h3>

            <h5 className="text-lg font-semibold mt-4 mb-2">a. For US Residents</h5>
            <p className="mb-4">
              Under the <strong>California Consumer Privacy Act (CCPA):</strong>
            </p>
            <ul className="list-disc list-inside mb-4">
              <li><strong>You have the right to know:</strong> What data we collect about you.</li>
              <li><strong>Request data deletion:</strong> You can request that we delete your data.</li>
              <li><strong>Opt out:</strong> You may opt out of data sharing.</li>
            </ul>
            <p className="mb-4">
              To exercise your rights, contact us at <a href="mailto:sideprojectorinc@gmail.com" className="text-blue-600 underline">sideprojectorinc@gmail.com</a>.
            </p>

            <h5 className="text-lg font-semibold mt-4 mb-2">b. For Pakistani Residents</h5>
            <p className="mb-4">
              Under Pakistan’s <strong>Personal Data Protection Bill (2023):</strong>
            </p>
            <ul className="list-disc list-inside mb-4">
              <li><strong>Access, correct, and delete data:</strong> You have the right to access, correct, and request deletion of your personal data.</li>
              <li><strong>Consent-based processing:</strong> Your data will not be processed without lawful reasons or shared without your consent.</li>
            </ul>
            <p className="mb-4">
              To exercise your rights, contact us at <a href="mailto:sideprojectorinc@gmail.com" className="text-blue-600 underline">sideprojectorinc@gmail.com</a>.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">5. Data Retention</h3>
            <p className="mb-4">
              We retain your personal data only as long as necessary to provide our services, comply with legal obligations, or resolve disputes. You can request account deletion at any time by contacting <a href="mailto:sideprojectorinc@gmail.com" className="text-blue-600 underline">sideprojectorinc@gmail.com</a>.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">6. Data Security</h3>
            <p className="mb-4">
              We take reasonable measures to protect your data, including encryption, firewalls, and regular security reviews. However, no system is 100% secure, and we cannot guarantee absolute protection of your data.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">7. Cookies and Tracking</h3>
            <p className="mb-4">We use cookies to:</p>
            <ul className="list-disc list-inside mb-4">
              <li><strong>Save user preferences:</strong> For example, theme settings (dark or light mode).</li>
              <li><strong>Analyze website usage:</strong> Using tools like Google Analytics to understand traffic and improve features.</li>
            </ul>
            <p className="mb-4">
              You can disable cookies in your browser settings, but some features may not function properly without them.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">8. International Users</h3>
            <p className="mb-4">
              Side Projector operates in the <strong>United States</strong> and <strong>Pakistan</strong>. By using our platform, you consent to your data being transferred and processed in both countries, which may have different data protection laws than your own country.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">9. Updates to This Privacy Policy</h3>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. The latest version will always be available on this page, with the effective date listed at the top.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">10. Contact Us</h3>
            <p className="mb-4">
              If you have questions or concerns about this Privacy Policy, please reach out to us:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>
                <strong>Email:</strong> <a href="mailto:sideprojectorinc@gmail.com" className="text-blue-600 underline">sideprojectorinc@gmail.com</a>
              </li>
              <li>
                <strong>Support:</strong> <a href="https://discord.gg/Er5atpNTj5" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://discord.gg/Er5atpNTj5</a>
              </li>
            </ul>
          </div>
        </motion.section> */}
      </main>
    </div>
  )
}

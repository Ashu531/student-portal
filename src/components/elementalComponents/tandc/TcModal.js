import React from 'react';

export default function TcModal({type, handleClose}) {
  return (
    <div className='tc'>
        <div className='tc-content'>
            <div className="close" onClick={handleClose}>&times;</div>
            {type === 'tc' && <div>
              <div className='headline'>Terms and Conditions</div>
              <div className='byline'>Last revised on <b>03 February, 2021</b></div>
              <p>
                  These Terms and Conditions (<b>“T&C”</b>) govern your use of the fee payment
                  system and your college’s use (<b>“them”</b>,  <b>“they”</b>,  <b>“college”</b>) of the fee
                  management   system   of   Credenc   Web   Technologies   Private   Limited
                  (hereinafter referred to as <b>“Credenc”</b>, <b>“we”</b>, <b>“us”</b>, <b>“our”</b>, <b>“Company”</b>).
                  By   accessing   and   using   our   Services,   you   acknowledge   that   you
                  (hereinafter   referred   to   as  <b>“you”</b>,   <b>“your”</b>,   <b>“student”</b>)   have   read,
                  understood, and agree to be lawfully bound by the contents of these
                  T&C.
              </p>

              <ol>
                <li>
                  INTRODUCTION
                  <p>
                    The   Fee   Management   System   (<b>“FMS”</b>),   owned   and   operated   by
                    Credenc helps and enables your college to:
                  </p>
                    <ul>
                        <li>collect online fee payment via payment gateway;</li>
                        <li>track and manage the entire fee collection;</li>
                        <li>send reminders to parents/students regarding payment of fees;</li>
                        <li>manage fee collection across multiple academic sessions;</li>
                        <li>keep a track of fees collected by them (both online and offline mode);</li>
                        <li>keep a track of batch wise and fee wise reports on collection;</li>
                        <li>customize fee for different categories; &</li>
                        <li>any other services as we may deem fit</li>
                    </ul>
                  <p>
                    The FMS also helps you to pay college fees online, keep a track of all
                    the fees paid by you, receive reminders for the fee payment, etc.
                    (collectively referred to as the <b>“Services”</b>)
                  </p>
                  <p>
                    By using our Services, you are deemed to have accepted the T&C
                    listed below and we reserve the right, in our sole discretion, to make
                    changes or modifications to these terms from time to time. Also, we
                    may, from time to time add on new features on the FMS or introduce
                    other Services. Any such amendments or modifications shall also be
                    subject to these T&C as well as any additional T&C that we may
                    release for those specific Services. These T&C constitutes a legal
                    binding contract between you and college on one part and Credenc on
                    the other part. You may request a pdf copy of the T&C by emailing us
                    at <a href='#'>legal@credenc.com</a>. These T&C is an electronic record under the
                    laws of India and need not be signed physically or digitally.
                  </p>
                </li>
                <li>
                  ACCESS TO SERVICE
                  <p>
                    In order to access our Services by you, you shall register your 
                    mobile number on our platform, post which you shall receive an OTP
                    on your registered mobile number, after which you can access our 
                    Service, i.e. payment of online fees and keep a track of all the fees 
                    paid by you to college. You can also access the Service by clicking 
                    the link sent by your college on your email, text message sent on 
                    your registered mobile number, etc. If any of your information is 
                    found to be inaccurate or out of date, you shall contact our 
                    Grievance Officer (details of which is mentioned at the bottom of this
                    T&C) and/or your college for further rectification of your 
                    information. Once we receive your request and verify the same 
                    satisfactorily, we shall proceed with assisting you on your request.
                  </p>
                </li>
                <li>
                  USAGE OF SERVICES
                  <ol>
                    <li className='ol-li'>Any and all the contents displayed on, or transmitted via, the Services provided to you is on a ‘as is’ basis and your access to and use of the Services and any content therein is at your own risk.</li>
                    <li className='ol-li'>You shall not use the Services in any way that violates any applicable laws.</li>
                    <li className='ol-li'>You shall not use the Services to impersonate or attempt to impersonate other students, etc.</li>
                    <li className='ol-li'>You shall not use the Services in any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or   harmful,   or   in   connection   with   any   unlawful,   illegal, fraudulent, or harmful purpose or activity. </li>
                    <li className='ol-li'>You   shall   not   reverse   engineer,   decompile,   disassemble   or otherwise attempt to discover the source code, object code or underlying structure, ideas, know-how or algorithms relevant to the Services or any software, documentation or data related to the Services.</li>
                    <li className='ol-li'>You shall not modify, translate, or create derivative works based on the Services or any software (except to the extent expressly permitted by the Company or authorized within the Services).</li>
                    <li className='ol-li'>You shall not access or use the Services in order to build or support, and/or assist a third party in building or supporting, products or Service competitive to Company.  </li>
                    <li className='ol-li'>You shall not remove or attempt to remove any proprietary notices and labels.</li>
                    <li className='ol-li'>We or our third-party service providers may from time-to-time upgrade, modify, alter or perform maintenance services on our FMS (“Maintenance   Services”). During the performance of such Maintenance Services, we shall use reasonable endeavors to ensure that the Services continue to be operational and available   and   in   the   event   the   Services   are   temporarily unavailable,   we   shall   endeavor   to   ensure   that   the   same   is available for utilization as soon as may be possible. </li>
                    <li className='ol-li'>Company shall not be held liable directly or indirectly for any loss   or  damage,  arising   directly   or   indirectly   to  you,   while initiating the payment, due to (a) any payment issues arising out of the transaction; or (b) decline of transaction for any other reason. However, we shall try from our end to resolve any such issues by coordinating with our third-party service providers, including but not limited to payment service providers.</li>
                    <li className='ol-li'>Refunds   initiated   will be  credited  to  the  account/card   from where   the   transaction   was   initiated   within   a   period   of   15 working days.</li>
                  </ol>
                </li>
                <li>
                  DATA PROTECTION
                  <p>
                    We will be processing the personal data and sensitive personal data
                    that is provided by you and/or your college, or collected by or for,
                    or processed in connection with our Services, subject to the terms
                    provided   in   our   PRIVACY   POLICY.   Please   take   a   moment   to
                    familiarize yourself with our Privacy Policy and let us know if you
                    have any questions.  You  accordingly  agree  and  consent  to us
                    collecting,   storing,   processing,   transferring,   and   sharing   your
                    personal   information   (including   sensitive   personal   information)
                    with third party service providers, including but not limited to
                    payment service providers, etc. in order to fulfill our obligations
                    with respect to the Services offered by us. The Company’s Privacy
                    Policy is subject to change at Company’s discretion.
                  </p>
                </li>
                <li>
                  LIMITATION OF LIABILITY AND DISCLAIMER OF WARRANTIES
                  <ol>
                    <li className='ol-li'>
                      Company shall use reasonable efforts consistent with prevailing
                      industry standards to maintain the Services in a manner which
                      minimizes errors and interruptions  in the Service and shall
                      perform the implementation of Services in a professional and
                      workmanlike manner. Services may be temporarily unavailable
                      for   scheduled   maintenance   or   for   unscheduled   emergency
                      maintenance, either by Company or by third-party providers, or
                      because of other causes beyond Company’s reasonable control,
                      but Company shall use reasonable efforts to ensure that the
                      same is available for utilization as soon as may be possible.
                      HOWEVER,   COMPANY   DOES   NOT   WARRANT   THAT   THE
                      SERVICES   WILL   BE   UNINTERRUPETED   OR   ERROR   FREE.
                      THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE”
                      FOR   YOUR   USE   AND   THE   COMPANY   DISCLAIMS   ALL
                      WARRANTIES, EXPRESS OR IMPLIED.
                    </li>
                    <li className='ol-li'>
                      In no case shall the Company, its affiliate entities, directors,
                      officers,   employees,   affiliates,   agents,   contractors,   service
                      providers or licensors be liable for any injury, loss, claim, or any
                      direct, indirect, incidental, punitive, special, or consequential
                      damages of any kind, including, without limitation  lost revenue,
                      lost savings, loss of data, replacement costs, or any similar
                      damages,   whether   based   in   contracts,   tort   (including
                      negligence), strict liability or otherwise, arising from your use
                      and/or your college’s use of the Services, or for any other claim
                      related in any manner to your use and/or your college’s use of
                      the   Services,   including,   but   not   limited   to,   any   errors   or
                      omissions in any content, or any loss or damage of any kind
                      incurred as a result of the use of the Services, even if advised of
                      their possibility.
                    </li>
                  </ol>
                </li>
                <li>
                  INDEMNITY
                  <ol>
                    <li className='ol-li'>
                      You agree to indemnify, defend and hold harmless the Company
                      and   its   subsidiaries,   affiliates,   partners,   officers,   directors,
                      agents,   contractors,   licensors,   service   providers,   employees,
                      from   any   losses,   injuries,   claims,   demands,   proceedings,
                      penalties, interest, costs and expenses, including reasonable
                      attorney’s fees, made by any third-party due to or arising out of
                      your breach of these T&C or the policies of the Company, or
                      your violation of any law or the rights of a third-party.
                    </li>
                    <li className='ol-li'>
                      The indemnification rights of the Company shall be in addition to
                      any   rights   that   may   be   available   to   the   Company   under
                      applicable law (including injunctions and specific performance
                      reliefs),   none   of   which   shall   be   affected   in   any   manner
                      whatsoever.
                    </li>
                  </ol>
                </li>
                <li>
                  INTELLECTUAL PROPERTY RIGHTS
                  <ol>
                    <li className='ol-li'>
                      Company shall own and retain all rights, title and interest in and
                      to   (i)   the   Services   and   software,   all   improvements,
                      enhancements   or   modification   thereto,   (ii)   any   software,
                      applications,   inventions   or   other   technology   developed   in
                      connection with the Services or support, and (iii) all intellectual
                      property rights related to any of the foregoing.
                    </li>
                    <li className='ol-li'>
                      The Services are protected by copyright, trademark and other
                      Indian laws. Nothing in these T&C or any policies gives you a
                      right to use the name or any trademark, logos, domain names,
                      or   any   other   intellectual   property   rights   of   the   Company,
                      without explicit written consent of the Company.
                    </li>
                    <li className='ol-li'>
                      Any   feedback,   comments,   or   suggestions   you   may   provide
                      regarding our Services is entirely voluntary and we will be free
                      to use such feedback comments or suggestions as we see fit and
                      without any obligation to you.
                    </li>
                  </ol>
                </li>
                <li>
                  SEVERABILITY
                  <p>
                    In the event any provisions of these T&C are determined to be
                    unlawful, void or unenforceable, such provision shall nonetheless
                    be enforceable to the fullest extent permitted by applicable law,
                    and the unenforceable portion shall be deemed to be severed from
                    these   T&C.   However,   such   determination   shall   not   affect   the
                    validity and enforceability of any other remaining provisions of
                    these T&C.
                  </p>
                </li>
                <li>
                  ASSIGNMENT
                  <p>
                    We may transfer, sub-contract or otherwise deal with its rights and/or
                    obligations under these T&C without notifying you or obtaining your
                    consent.
                  </p>
                </li>
                <li>
                  GOVERNING LAW & JURISDICTION
                  <p>
                    This T&C and the policies which govern the Services, shall be
                    governed by and construed in accordance with the laws of India.
                    Any dispute or claims arising in relation to the Services shall be
                    subject to the exclusive jurisdiction of the courts in New Delhi,
                    India.
                  </p>
                </li>
                <li>
                  ENTIRE AGREEMENT
                  <ol>
                    <li className='ol-li'>
                      The failure to exercise or enforce any right or provisions of
                      these   T&C   shall   not   constitute   a   waiver   of   such   right   or
                      provision.
                    </li>
                    <li className='ol-li'>
                      This T&C and any policies in respect of the use of the Services
                      constitutes the entire understanding between you/your college
                      and   us   and   governs   your   and/or   your   college’s   use   of  our
                      Services. 
                    </li>
                    <li className='ol-li'>
                      Any   ambiguities   in   the   interpretation   of   this   T&C   and   the
                      policies shall not be construed against the drafting party.
                    </li>
                  </ol>
                </li>
                <li>
                    REGULAR REVIEW OF T&C
                  <p>
                    We reserve the right, in our sole discretion,  to update, make
                    changes   or   modifications   to   this   T&C   from   time   to   time.   We
                    encourage you to periodically review this page for the latest T&C.
                  </p>
                </li>
                <li>
                  FEEDBACK & COMMENTS
                  <ol>
                    <li className='ol-li'>
                      Any rectification of data, allegations, complaints, or questions
                      about the content, comment, or a violation of these T&C must be
                      reported   promptly   to   the   legal   department   at <a href='#'>legal@credenc.com</a>, or in writing at the following address to:<br/>
                      <i>
                        Name: Shijin Abraham<br/>
                        Designation: Legal Officer<br/>
                        Address: 3rd  Floor, Tower-B, DLF Building No. 8, DLF Cyber<br/>
                        City, Gurugram, Haryana-122002<br/>
                      </i>
                    </li>
                    <li className='ol-li'>
                      Any specific submissions, payment related issues, feedbacks,
                      suggestions, comment, requests, with respect to the Services or
                      any features of the Services shall be sent to the product team at <a href='#'>aaryaman.singh@credenc.com</a>, or in writing at the following
                      address to:<br/>
                      <i>
                        Name: Aaryaman Singh<br/>
                        Designation: Product Manager<br/>
                        Address: 3rd  Floor, Tower-B, DLF Building No. 8, DLF Cyber<br/>
                        City, Gurugram, Haryana-122002
                      </i>
                    </li>
                  </ol>
                </li>
              </ol>

            </div>}
            {type === 'pp' && <div>
            <div className='headline'>Privacy Policy</div>
              <div className='byline'>This Privacy Policy was last revised on <b>03 February, 2022</b></div>
              <p>
                This Privacy Policy (<b>“Policy”</b>) explains how Credenc Web Technologies 
                Private Limited (<b>“Company”</b>, <b>“Credenc”</b>, <b>“we”</b>, <b>“us”</b>, <b>“our”</b>) collects 
                and uses your information (<b>“User”</b>, <b>“you”</b>, <b>“your”</b>, <b>“Students”</b>) in 
                relation to your college’s access and usage of our fee management 
                system (<b>“Services”</b>), owned and operated by Credenc Web Technologies 
                Private Limited on the website/domain (<b>“Platform”</b>).
              </p>
              <p>
                In this Privacy Policy, “Personal Information” or “Personally Identifiable 
                Information” means that can be used to directly or indirectly identify a 
                person, either from that information alone or from that information 
                combined with other information we have access to, about that 
                individual. 
              </p>
              <p>
                If you have any questions or concerns regarding this Policy, you should 
                contact our Grievance Office at <a href='#'>legal@credenc.com</a>.
              </p>

              <p><b><i>
                This Policy is published pursuant to, and in compliance with the 
                Information Technology Act, 2000, and the rules thereunder, 
                more specifically the Information Technology (Reasonable 
                Security Practices and Procedures and Sensitive Personal Data or 
                Information) Rules, 2011.
              </i></b></p>

              <hr/>
              <li style={{listStyle: 'none'}}>
                CONSENT
                <p>
                  By accessing our Platform, we shall understand that you are aware of 
                  this Policy and its contents and have provided your informed consent to 
                  process your information as provided. You accordingly agree and consent
                  to us collecting, storing, processing, transferring, and sharing your 
                  Personal Information (including Sensitive Data) with third parties or 
                  service providers for the purposes set out in this Policy.
                </p>
              </li>

              <hr/>
              <li style={{listStyle: 'none'}}>
                TYPES OF DATA COLLECTED
                <p>
                  While using our Service, we may ask you to provide us with certain 
                  Personally Identifiable Information that can be used to identify you. 
                  Collection of such data and information is essential for the purpose of 
                  serving the best version of our Service. We may collect the below 
                  mentioned information:
                </p>

                <ul>
                  <li>
                    <i>Personal Information</i>: We may collect Personal Information including,
                    but not limited to name, email address, mobile number, bank account 
                    information, parent’s information, category, etc., and any other 
                    information we consider necessary to enhance your and your college’s
                    experience on the Platform.
                  </li>
                  <li>
                    <i>Usage data</i>: We may collect information that your browser sends 
                    whenever you visit our Platform and/or use the Services by or through
                    any device. The usage data includes, but is not limited to IP address, 
                    browser type & version, the time and date of your visit, etc. 
                  </li>
                  <li>
                  <i>Sensitive Data</i>: We may also by your usage of the Services and usage 
                    and/or provisions of third parties or service providers, collect, 
                    receive, possess, store, deal or handle, directly or indirectly the 
                    following sensitive personal data or information including your 
                    financial information such as bank account or credit card or debit 
                    card, or other payment instrument details (“Sensitive Data”).
                  </li>
                </ul>
              </li> 

              <hr/>
              <li style={{listStyle: 'none'}}>
                WHY DO WE STORE DATA?
                <p>
                  We store data for internal record keeping, collect fees and to fulfil our 
                  obligations with respect to the Services provided to your college by 
                  providing them with information in a systematic and a flexible manner 
                  pertaining to overview of students, collection, transactions, etc. We also 
                  store data to dispatch transaction related communications such as fee 
                  payment reminders, payment acknowledgement, etc. With the help of 
                  data, we also provide you the information with respect to your payment 
                  of fees in a systematic manner.
                </p>
              </li>

              <hr/>
              <li style={{listStyle: 'none'}}>
                DATA RETENTION
                <p>
                  We will only retain your personal data for as long as it is necessary for 
                  the purposes set out in this Policy. We will retain and use your Personal 
                  Data to the extent necessary to fulfil our obligations with respect to the 
                  Services offered by us and/or to comply with legal and regulatory 
                  obligations authorized by law.
                </p>
                <p>
                  We will only retain your usage data for internal analysis purposes. Usage 
                  data is generally retained for a shorter period, except when this data is 
                  used to strengthen the security or to improve the functionality of our 
                  Service, or we are legally obligated to retain this data for longer time 
                  periods.
                </p>
              </li>

              <hr/>
              <li style={{listStyle: 'none'}}>
                CONFIDENTIALITY
                <p>
                  Your information is regarded as confidential and therefore will not be 
                  divulged to any third party, unless if legally required to do so to the 
                  appropriate authorities. We will not sell, share, or rent your Personal 
                  Information to any third party, except as mentioned in <i>“Disclosure of 
                  Data”</i>, or use your e-mail address for unsolicited mail. Any emails sent by
                  us will only be in connection with the provision of agreed Services with 
                  your college.
                </p>
              </li>

              <hr/>
              <li style={{listStyle: 'none'}}>
                DISCLOSURE OF DATA
                <ul>
                  <li>
                    <i>Law and order</i>: We reserve the right to use or disclose your personal 
                      data in response to any statutory or legal requirements. We will 
                      disclose your personal data if we believe it is necessary to share 
                      information in order to investigate, prevent, or take action regarding 
                      illegal activities, suspected fraud, violations of the Platform’s other 
                      policies, or as otherwise required by law when responding to court 
                      orders and other legal process.
                  </li>
                  <li>
                    <i>Third-party service providers</i>: For the purpose of making available 
                      our Services, we may engage with third parties and/or service 
                      providers, and they may have access to your Personal Information, 
                      including Sensitive Data. However, they are obligated to not disclose 
                      or use the information for any other purpose. 
                  </li>
                  <li>
                    <i>Other disclosures</i>: We may also disclose your personal data to our 
                      subsidiaries and affiliates, for any other purpose disclosed by us when
                      you provide the information, and with your consent in any other 
                      cases.
                  </li>
                </ul>
              </li>

              <hr/>
              <li style={{listStyle: 'none'}}>
                CONFIDENTIALITY
                <p>
                  We are striving to use commercially acceptable means of protecting your 
                  Personal Information. We undertake reasonable security practices and 
                  procedures designed to protect such information from unauthorized 
                  access, damage, use, modification, disclosure or impairment. But 
                  remember that no method of transmission over the internet, or method of
                  electronic storage is 100% secure and reliable, and we cannot guarantee 
                  its absolute security.
                </p>
                <p>
                  In accordance with Information Technology Act, 2000 and rules made 
                  thereunder, the name and contact details of the Grievance Officer are 
                  provided below:<br/>
                  <i>
                    Name: Shijin Abraham<br/>
                    Address: 3rd  Floor, Tower-B, DLF Building No. 8, DLF Cyber<br/>
                    City, Gurugram, Haryana-122002<br/>
                    e-mail: <a href='#'>legal@credenc.com</a>
                  </i>
                </p>
              </li>

              <hr/>
              <li style={{listStyle: 'none'}}>
                RECTIFICATION OF DATA
                <p>
                  If any of your Personal Information is found to be inaccurate or out of 
                  date, you shall contact our Grievance Officer and/or your college for 
                  further rectification of your personal data. Once we receive your request 
                  and verify the same satisfactorily, we shall proceed with assisting you on 
                  your request.
                </p>
              </li>

              <hr/>
              <li style={{listStyle: 'none'}}>
                REGULAR REVIEW OF PRIVACY POLICY
                <p>
                  We keep our Privacy Policy under regular review and may update the 
                  same to reflect changes to our information related practices. We 
                  encourage you to periodically review this page for the latest information 
                  on our privacy practices.
                </p>
              </li>

              <p>
                <b>CONTENT OWNERSHIP</b>: This Policy and the information contained 
                herein is the sole and exclusive property of Credenc Web Technologies 
                Private Limited and shall not be copied, reproduced or quoted anywhere, 
                whether verbally or in writing, without prior written consent of Credenc 
                Web Technologies Private Limited.
              </p>

              <p style={{textAlign: 'center'}}><b>
                COPYRIGHT: Credenc Web Technologies Private Limited - Year:2022
              </b></p>
            </div>}
        </div>
    </div>
  );
}

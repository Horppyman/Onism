/** reset password template */
class resetPasswordEmail {
  /**
   * Template for reset password email
   * @param {string} url
   * @param {object} user
   * @returns {object} email to be sent
   */
  static resetTemplate(url, user) {
    const html = `
      <body style="margin: 0; padding: 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="900px"
              style="padding: 0 40px 0 40px; background-color:#f1f2f3;">
              <tr>
                  <td align="center" style="background-color:#f9fcff; margin: 0 50px 0 50px;">
                      <a><img src="https://res.cloudinary.com/aboyeji-barnes-backstars/image/upload/v1588818157/aboyeji-barnes-backstars/Barnes_2_cpqaef.jpg" alt="Barnes Backstars" width="120" height="100" style="display: block;></a>
                  </td>
              </tr>
             <td align=" center" style="padding: 0 50px 0 50px;">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%"
                              style="background-color:#ffffff; padding: 0 0 0 20px;">
                              <tr>
                                  <td align="center" style="font-family: Arial, sans-serif; font-size: 24px; color: #050505;">
                                      <p>Hi ${user.firstName},</p>
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center"
                                      style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                      <p>We have received a request to change the password of your Onism account
                                      </p>
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center">
                                      <a style="width:250px; display:inline-block; text-decoration: none; font-size: 15px;text-align: center;
                    background-color:#55acee;border-radius:2px;color:white;height:32px; cursor: pointer; padding-top:5px"
                                          href=${url}>Reset Password</a></td>
                              </tr>
                              <tr>
                                  <td align="center"
                                      style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
                                      <p>This link will expire after 24 hours.</p>
                                      <p>contact <a href="#">support@onism</a> if you didn't initiate this request
                                      </p>
                                      <p>Thank you for choosing Onism</p>
                                  </td>
                              </tr>
                          </table>
                  </td>
              </tr>
              <tr>
                  <td align="center" style="padding: 30px 30px 30px 30px;">
                      Barnes Backstars,&copy; 2020<br />
                  </td>
              </tr>
          </table>
      </body>`;

    return { html };
  }
}

export default resetPasswordEmail;

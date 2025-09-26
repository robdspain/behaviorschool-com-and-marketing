# Content Authenticity Agent

## Purpose
An automated agent to regularly check all three sites (robspain.com, behaviorschool.com, study.behaviorschool.com) for fake statistics, fabricated quotes, false citations, or fake testimonials.

## Usage Instructions

### Option 1: Manual Script Execution
```bash
# Navigate to marketing suite directory
cd "/Users/robspain/Desktop/marketing suite"

# Run the audit script
node scripts/content-authenticity-audit.js
```

### Option 2: Claude Agent (Recommended)
Use this prompt with Claude to run a comprehensive audit:

---

**AGENT PROMPT:**
```
I need you to perform a content authenticity audit across three websites to identify any fake statistics, fabricated quotes, false citations, or fake testimonials.

**Sites to audit:**
1. robspain.com - located at /Users/robspain/Desktop/robspain.com/
2. behaviorschool.com - located at /Users/robspain/Desktop/marketing suite/
3. study.behaviorschool.com - referenced in links

**Search for these red flags:**

**HIGH RISK:**
- Specific percentages without sources (e.g., "95% pass rate", "80% improvement")
- User count claims (e.g., "[large number]+ users", "[number] students")
- Testimonials with full names and specific outcomes
- Revenue/financial metrics without verification
- Citations to studies that don't exist

**MEDIUM RISK:**
- Vague research claims ("research shows", "studies prove")
- Effectiveness guarantees ("proven results", "guaranteed success")
- Unrealistic time claims ("in just 3 days")
- Awards/rankings without specifics

**LOW RISK (verify periodically):**
- Professional credentials (BCBA, IBA)
- Years of experience claims
- General improvement language

**Provide:**
1. List of all flagged content with file locations
2. Risk assessment (High/Medium/Low)
3. Verification recommendations
4. Suggested fixes for any fake content

Search all HTML, TSX, JSX, and MD files. Focus on BCBA exam claims, testimonials, statistics, and research references.
```

---

## Schedule

### Regular Audit Schedule
- **Monthly**: Full audit using Claude agent
- **Before major content updates**: Quick script run
- **Quarterly**: Deep verification of all claims
- **Before marketing campaigns**: Comprehensive review

### When to Run Immediate Audit
- Adding new testimonials
- Including statistics or research claims
- Before press releases or media coverage
- When competitors make authenticity claims against you
- After content team changes

## Red Flags to Always Check

### Statistics & Numbers
- ❌ "95% of our users pass the BCBA exam"
- ❌ "[large number]+ BCBAs trust our platform"
- ❌ "Increase scores by 40%"
- ✅ "Many users report improved confidence"
- ✅ "Designed to support exam preparation"

### Testimonials
- ❌ "Amazing results! - Dr. Sarah Johnson, BCBA"
- ❌ "Passed my exam in 30 days - Mark S."
- ✅ Anonymous feedback without specific outcomes
- ✅ General satisfaction without claims

### Research Claims
- ❌ "According to Stanford University research..."
- ❌ "Studies show our method increases pass rates"
- ✅ "Based on evidence-based practices"
- ✅ "Aligned with behavioral science principles"

### Professional Claims
- ✅ Rob Spain's actual credentials (BCBA, IBA)
- ✅ Verified years of experience
- ❌ Fake awards or certifications
- ❌ Inflated client numbers

## File Monitoring

### High Priority Files
```
/src/app/page.tsx (homepage claims)
/src/app/about/AboutContent.tsx (bio information)
/src/app/bcba-exam-prep/page.tsx (exam claims)
/index.html (robspain.com personal claims)
/cv.html (professional credentials)
```

### Content Areas to Watch
- Hero sections with bold claims
- About pages with professional history
- Service descriptions with effectiveness claims
- Footer content with business metrics
- Testimonial sections
- Case study content

## Response Actions

### If High-Risk Content Found
1. **IMMEDIATE**: Remove or modify content
2. **VERIFY**: Check if claim can be substantiated
3. **DOCUMENT**: Record verification sources
4. **UPDATE**: Replace with qualified language
5. **MONITOR**: Add to monthly review list

### If Medium-Risk Content Found
1. **REVIEW**: Assess claim validity
2. **QUALIFY**: Add disclaimers ("may", "can", "typically")
3. **SOFTEN**: Use less absolute language
4. **SCHEDULE**: Plan for verification

### If Low-Risk Content Found
1. **VERIFY**: Confirm accuracy periodically
2. **DOCUMENT**: Maintain source records
3. **MONITOR**: Include in regular audits

## Documentation Requirements

### Maintain Records Of
- All statistics and their sources
- Professional credentials and verification dates
- Client feedback and permission to use
- Research references and citations
- Award and recognition documentation

### Source Documentation Format
```
Claim: "Board Certified Behavior Analyst since 2011"
Source: BACB Certification Registry
Verification Date: [Date]
Expiration: [If applicable]
Last Checked: [Date]
```

## Emergency Response

### If Fake Content Is Discovered
1. **IMMEDIATE REMOVAL** - Don't wait for verification
2. **SITE-WIDE SCAN** - Check for similar issues
3. **SOURCE REVIEW** - Identify how fake content was added
4. **PROCESS UPDATE** - Prevent future occurrences
5. **TRANSPARENCY** - Address publicly if necessary

### Contact Protocol
- **High Risk Found**: Immediate team notification
- **Compliance Issues**: Legal review if needed
- **Competitor Claims**: Document and respond appropriately

## Best Practices

### Content Creation
- Always verify before publishing
- Use qualified language ("may", "can", "often")
- Avoid specific percentages without sources
- Keep testimonials anonymous or get written permission
- Document all sources immediately

### Content Review
- Two-person approval for claims
- Source verification required
- Legal review for bold statements
- Regular team training on authenticity standards

## Tools & Resources

### Verification Tools
- BACB Registry for credentials
- Google Scholar for research
- Wayback Machine for historical claims
- Corporate records for business metrics

### Audit Tools
1. **Automated Script**: `/scripts/content-authenticity-audit.js`
2. **Claude Agent**: Use prompt above
3. **Manual Review**: Quarterly deep dive
4. **Competitor Monitoring**: Check industry standards

---

**Last Updated**: [Current Date]
**Next Review**: [Monthly]
**Owner**: Content Team
**Escalation**: Rob Spain for credential issues, Legal for compliance concerns
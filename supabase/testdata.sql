-- ============================================
-- TESTDATA - CUSTOMERS
-- ============================================

insert into customers
(name,type,phone,mobile,email,website,status,notes)

values

(
'Gemeente Veendam',
'municipality',
'0598-000000',
'',
'info@veendam.nl',
'https://www.veendam.nl',
'active',
'Gemeente'
),

(
'Stichting Zomerfeest',
'association',
'050-1111111',
'',
'info@zomerfeest.nl',
'',
'prospect',
'Organiseert jaarlijks evenement'
),

(
'Camping De Horizon',
'company',
'0599-222222',
'06-12345678',
'info@camping.nl',
'https://camping.nl',
'active',
'Vaste klant'
),

(
'Jan Jansen',
'person',
'',
'06-87654321',
'jan@example.nl',
'',
'prospect',
'Particulier'
);

-- ============================================
-- LOCATIONS
-- ============================================

insert into locations

(name,address,postal_code,city,province,type,has_power,has_water,stand_fee)

values

(
'Markt Veendam',
'Museumplein',
'9641AD',
'Veendam',
'Groningen',
'market',
true,
false,
75
),

(
'Zomerfestival Groningen',
'Stadspark',
'9727KG',
'Groningen',
'Groningen',
'festival',
true,
true,
250
),

(
'Camping De Horizon',
'Bosweg 12',
'9461AA',
'Gieten',
'Drenthe',
'camping',
true,
true,
40
);

-- ============================================
-- BOOKINGS
-- ============================================

insert into bookings

(customer_id,
location_id,
booking_date,
status,
expected_revenue,
actual_revenue,
notes)

select

c.id,
l.id,
current_date + 14,
'confirmed',
1200,
null,
'Eerste testboeking'

from customers c

join locations l
on l.name='Markt Veendam'

where c.name='Gemeente Veendam';

insert into bookings

(customer_id,
location_id,
booking_date,
status,
expected_revenue)

select

c.id,
l.id,
current_date + 30,
'requested',
2000

from customers c

join locations l
on l.name='Zomerfestival Groningen'

where c.name='Stichting Zomerfeest';

-- ============================================
-- CONTACTS
-- ============================================

insert into contacts

(customer_id,
type,
note,
next_action_date)

select

id,
'call',
'Kennismakingsgesprek gevoerd.',
current_date + 7

from customers

where name='Camping De Horizon';

insert into contacts

(customer_id,
type,
note)

select

id,
'email',
'Offerte verzonden.'

from customers

where name='Gemeente Veendam';

-- ============================================
-- TASKS
-- ============================================

insert into tasks

(customer_id,
title,
description,
due_date,
priority)

select

id,
'Terugbellen',
'Bespreken definitieve boeking',
current_date + 3,
'high'

from customers

where name='Stichting Zomerfeest';

insert into tasks

(customer_id,
title,
description,
due_date)

select

id,
'Contract versturen',
'Na bevestiging digitaal ondertekenen',
current_date + 5

from customers

where name='Gemeente Veendam';

-- ============================================
-- DOCUMENTS
-- ============================================

insert into documents

(customer_id,
filename,
storage_path)

select

id,
'concept_contract.pdf',
'contracts/concept_contract.pdf'

from customers

where name='Gemeente Veendam';